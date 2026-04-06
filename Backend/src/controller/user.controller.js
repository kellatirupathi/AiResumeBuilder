// C:\Users\NxtWave\Downloads\code\Backend\src\controller\user.controller.js
import mongoose from "mongoose";
import User from "../models/user.model.js";
import NiatId from "../models/niatId.model.js";
import ExternalInvite from "../models/externalInvite.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/email.service.js";
import crypto from "crypto";
import { createOrUpdatePortfolio } from '../services/github.service.js';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import {
  getClearCookieOptions,
  getCookieOptions,
  getUserTokenExpiry,
} from "../utils/authSession.js";

// --- START: REGISTER ALL HANDLEBARS HELPERS ---
handlebars.registerHelper('split', function(string, separator) {
  if (typeof string !== 'string') return [];
  return string.split(separator);
});
handlebars.registerHelper('trim', function(string) {
  if (typeof string !== 'string') return '';
  return string.trim();
});
handlebars.registerHelper('substring', function(string, start, end) {
    if (typeof string !== 'string') return '';
    return string.substring(start, end);
});
handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
});
handlebars.registerHelper('isEqual', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('formatDate', function(date) {
  if (!date) return '';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date;
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${month} ${year}`;
  } catch (e) {
    return date;
  }
});
handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});
handlebars.registerHelper('or', function(a, b) {
  return a || b;
});
handlebars.registerHelper('formatUrl', function(url) {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
});
handlebars.registerHelper('replaceSeparator', function(str, oldSep, newSep) {
  if (!str) return '';
  return str.split(oldSep).join(newSep);
});
handlebars.registerHelper('firstChar', function(str) {
  if (!str) return '';
  return str.charAt(0);
});
handlebars.registerHelper('if_even', function(index, options) {
  if ((index % 2) === 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
handlebars.registerHelper('if_odd', function(index, options) {
  if ((index % 2) === 1) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
handlebars.registerHelper('contains', function(str, searchTerms) {
    if (!str || typeof str !== 'string' || !searchTerms || typeof searchTerms !== 'string') {
        return false;
    }
    const terms = searchTerms.split(',');
    const found = terms.some(term => str.toLowerCase().includes(term.trim().toLowerCase()));
    return found;
});
// --- END: REGISTER HANDLEBARS HELPERS ---

const sanitizeUserPayload = (userDocument) => {
  const userObject = userDocument?.toObject ? userDocument.toObject() : userDocument;

  if (!userObject) {
    return null;
  }

  delete userObject.password;
  delete userObject.forgotPasswordToken;
  delete userObject.forgotPasswordTokenExpiry;

  const nameParts = typeof userObject.fullName === "string"
    ? userObject.fullName.trim().split(/\s+/)
    : [];
  userObject.firstName = userObject.firstName || nameParts[0] || "";
  userObject.lastName =
    userObject.lastName || nameParts.slice(1).join(" ") || "";

  return userObject;
};

const hashInviteToken = (token) =>
  crypto.createHash("sha256").update(String(token || "")).digest("hex");

const buildInviteQuery = (token) => ({
  tokenHash: hashInviteToken(token),
  status: "active",
  expiresAt: { $gt: new Date() },
});

const getInvitePublicData = (inviteDocument) => {
  if (!inviteDocument) {
    return null;
  }

  return {
    id: inviteDocument._id,
    code: inviteDocument.code,
    expiresAt: inviteDocument.expiresAt,
    status: inviteDocument.status,
  };
};

const resolveValidInvite = async (token, { markOpened = false } = {}) => {
  if (!token) {
    return null;
  }

  const invite = await ExternalInvite.findOne(buildInviteQuery(token));

  if (!invite) {
    return null;
  }

  if (markOpened) {
    invite.openCount += 1;
    invite.lastOpenedAt = new Date();
    invite.openedAt.push(invite.lastOpenedAt);
    await invite.save();
  }

  return invite;
};

const markInviteSignup = async (inviteId) => {
  if (!inviteId) {
    return;
  }

  const invite = await ExternalInvite.findById(inviteId);
  if (!invite) {
    return;
  }

  invite.signupCount += 1;
  invite.lastSignedUpAt = new Date();
  invite.usedAt.push(invite.lastSignedUpAt);
  await invite.save();
};

const start = async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, sanitizeUserPayload(req.user), "User Found"));
  } else {
    return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
  }
};

const getSession = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No active session."));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "No active session."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, sanitizeUserPayload(user), "Active session found."));
  } catch (error) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No active session."));
  }
};

const getExternalInviteDetails = async (req, res) => {
  const token = String(req.query.token || "");
  const markOpened = String(req.query.markOpened || "true").toLowerCase() !== "false";

  if (!token) {
    return res
      .status(400)
      .json(new ApiError(400, "Invite token is required."));
  }

  try {
    const invite = await resolveValidInvite(token, { markOpened });

    if (!invite) {
      return res
        .status(400)
        .json(new ApiError(400, "This invite link is invalid or has expired."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getInvitePublicData(invite),
          "Invite link is valid."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to validate invite link.", [], error.stack));
  }
};

const registerUser = async (req, res) => {
  console.log("Registration Started");
  const { fullName, email, password, niatId, inviteToken } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedNiatId = String(niatId || "").trim().toUpperCase();

  try {
    const invite = inviteToken ? await resolveValidInvite(inviteToken) : null;
    const isExternalInviteFlow = Boolean(invite);

    if (!fullName || !normalizedEmail || !password || (!isExternalInviteFlow && !normalizedNiatId)) {
      console.log("Registration Failed data insufficient");
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            isExternalInviteFlow
              ? "Please provide all required fields: Full Name, Email, and Password."
              : "Please provide all required fields: Full Name, NIAT ID, Email, and Password."
          )
        );
    }

    if (inviteToken && !invite) {
      return res
        .status(400)
        .json(new ApiError(400, "This invite link is invalid or has expired."));
    }

    if (!isExternalInviteFlow) {
      const niatIdRecord = await NiatId.findOne({ niatId: normalizedNiatId });
      if (!niatIdRecord) {
          console.log(`Registration Failed: NIAT ID not found in the database - ${normalizedNiatId}`);
          return res
              .status(400)
              .json(new ApiError(400, "Your NIAT ID is not registered in our system. Please crosscheck and enter the correct NIAT ID."));
      }
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log("Registration Failed already registered user");
      return res
        .status(409)
        .json(new ApiError(409, "User with this email already registered."));
    }

    if (!isExternalInviteFlow) {
      const existingNiatId = await User.findOne({ niatId: normalizedNiatId });
      if (existingNiatId) {
        console.log("Registration Failed already registered user with this NIAT ID");
        return res
          .status(409)
          .json(new ApiError(409, "This NIAT ID has already been used to create an account."));
      }
    }

    const newUser = await User.create({
      fullName,
      niatId: isExternalInviteFlow ? undefined : normalizedNiatId,
      email: normalizedEmail,
      password,
      niatIdVerified: !isExternalInviteFlow,
      userType: isExternalInviteFlow ? "external" : "internal",
      authProvider: "password",
      externalInvite: invite?._id || null,
    });

    if (invite?._id) {
      await markInviteSignup(invite._id);
    }

    sendWelcomeEmail(newUser.fullName, newUser.email).catch(err => {
      console.error(`[Non-blocking Error] Failed to send welcome email to ${newUser.email}:`, err.message);
    });

    console.log("Registration Successful");
    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            niatId: newUser.niatId,
            niatIdVerified: newUser.niatIdVerified,
            userType: newUser.userType,
            externalInvite: newUser.externalInvite,
          },
        },
        "User successfully registered."
      )
    );
  } catch (err) {
    console.log("Registration Failed due to server error");
    console.error("Error while creating user:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

const loginUser = async (req, res) => {
  console.log("Login Started");
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Login Failed: Missing required fields");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: email and password."
        )
      );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login Failed: User not found");
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      console.log("Login Failed: Invalid credentials");
      return res.status(401).json(new ApiError(401, "Invalid credentials."));
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: getUserTokenExpiry() }
    );
    const cookieOptions = getCookieOptions();

    console.log("Login Successful");
    return res
      .cookie("token", jwtToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            niatId: user.niatId,
            niatIdVerified: user.niatIdVerified,
            userType: user.userType,
            externalInvite: user.externalInvite,
          },
          "User logged in successfully."
        )
      );
  } catch (err) {
    console.log("Login Failed: Server error");
    console.error("Error during login:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], err.stack));
  }
};

const googleLogin = async (req, res) => {
  const { credential, inviteToken } = req.body;
  if (!credential) {
    return res.status(400).json(new ApiError(400, "Google credential is required."));
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name: fullName } = payload;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const invite = inviteToken ? await resolveValidInvite(inviteToken) : null;
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      if (inviteToken && !invite) {
        return res.status(400).json(new ApiError(400, "This invite link is invalid or has expired."));
      }

      const password = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        fullName,
        email: normalizedEmail,
        password,
        userType: invite ? "external" : "internal",
        authProvider: "google",
        externalInvite: invite?._id || null,
      });

      if (invite?._id) {
        await markInviteSignup(invite._id);
      }

      sendWelcomeEmail(user.fullName, user.email).catch(err => {
        console.error(`[Non-blocking Error] Failed to send Google welcome email to ${user.email}:`, err.message);
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: getUserTokenExpiry() }
    );
    const cookieOptions = getCookieOptions();

    return res
      .cookie("token", jwtToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            niatId: user.niatId,
            niatIdVerified: user.niatIdVerified,
            userType: user.userType,
            externalInvite: user.externalInvite,
          },
          "User authenticated successfully with Google."
        )
      );

  } catch (err) {
    console.error("Error during Google authentication:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Google authentication failed.", [], err.stack));
  }
};


const logoutUser = (req, res) => {
  console.log("Logout attempt");
  const cookieOptions = getClearCookieOptions();
  
  return res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully."));
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(new ApiError(400, "Email address is required."));
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json(new ApiResponse(200, null, "If an account with that email exists, a password reset link has been sent."));
      }
  
      const token = crypto.randomBytes(32).toString('hex');
      user.forgotPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      user.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;
  
      await user.save({ validateBeforeSave: false });
  
      const resetLink = `${process.env.ALLOWED_SITE}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.fullName, user.email, resetLink);
  
      return res.status(200).json(new ApiResponse(200, null, "If an account with that email exists, a password reset link has been sent."));
    } catch (err) {
      console.error("Error requesting password reset:", err);
      return res.status(500).json(new ApiError(500, "Could not process the request.", [], err.stack));
    }
};
  
const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
  
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json(new ApiError(400, "All fields are required."));
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json(new ApiError(400, "Passwords do not match."));
    }
    if (newPassword.length < 6) {
        return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long."));
    }
  
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
      const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json(new ApiError(400, "This reset link is invalid or has expired. Please request a new one."));
      }
  
      user.password = newPassword;
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
  
      await user.save();
  
      return res.status(200).json(new ApiResponse(200, null, "Your password has been successfully reset. Please sign in with your new password."));
    } catch (err) {
      console.error("Error resetting password:", err);
      return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
    }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required."));
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json(new ApiError(400, "New passwords do not match."));
  }
  if (newPassword.length < 6) {
    return res.status(400).json(new ApiError(400, "New password must be at least 6 characters long."));
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) return res.status(401).json(new ApiError(401, "Incorrect current password."));
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully."));
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User profile not found."));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sanitizeUserPayload(user),
          "Profile fetched successfully."
        )
      );
  } catch (err) {
    return res.status(500).json(new ApiError(500, "Internal Server Error", [], err.stack));
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));
    const { firstName, lastName, ...otherData } = req.body;
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    Object.assign(user, otherData); 
    user.fullName = fullName; 
    const updatedUser = await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sanitizeUserPayload(updatedUser),
          "Profile updated successfully."
        )
      );
  } catch (err) {
    return res.status(500).json(new ApiError(500, "Failed to update profile", [], err.stack));
  }
};

const generatePortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));
    const { templateName = 'portfolio-classic' } = req.body;
    const allowedTemplates = ['portfolio-classic', 'portfolio-modern'];
    if (!allowedTemplates.includes(templateName)) {
        return res.status(400).json(new ApiError(400, "Invalid template name."));
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.handlebars`);
    if (!fs.existsSync(templatePath)) {
        return res.status(404).json(new ApiError(404, "Template not found on server."));
    }
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);
    const htmlContent = compiledTemplate(user.toObject());
    const portfolioUrl = await createOrUpdatePortfolio(user, htmlContent);
    user.portfolioUrl = portfolioUrl;
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sanitizeUserPayload(user),
          "Portfolio generated successfully!"
        )
      );
  } catch (err) {
    console.error("Error generating portfolio:", err);
    return res.status(500).json(new ApiError(500, "Failed to generate portfolio.", [], err.stack));
  }
};

const completeProfile = async (req, res) => {
  const { niatId } = req.body;
  const userId = req.user._id;

  if (!niatId) {
    return res.status(400).json(new ApiError(400, "NIAT ID is required."));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    if (user.niatIdVerified) {
      return res.status(400).json(new ApiError(400, "Profile is already complete."));
    }

    if (user.userType === "external") {
      return res
        .status(400)
        .json(new ApiError(400, "External invited users do not require Student ID completion."));
    }

    // Validate the NIAT ID
    const niatIdRecord = await NiatId.findOne({ niatId });
    if (!niatIdRecord) {
      return res.status(400).json(new ApiError(400, "This NIAT ID is not registered in our system."));
    }
    
    // Check if another user has already taken this NIAT ID
    const existingNiatUser = await User.findOne({ niatId });
    if (existingNiatUser && existingNiatUser._id.toString() !== userId.toString()) {
      return res.status(409).json(new ApiError(409, "This ID is already associated with another account."));
    }
    
    // Update the user
    user.niatId = niatId;
    user.niatIdVerified = true;
    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sanitizeUserPayload(user),
          "Profile completed successfully."
        )
      );

  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], error.stack));
  }
};


const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notificationPreferences");
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));

    const prefs = user.notificationPreferences ?? { reminder: true, downloadLink: true };
    return res.status(200).json(new ApiResponse(200, prefs, "Notification preferences fetched."));
  } catch (err) {
    console.error("getNotificationPreferences error:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

const updateNotificationPreferences = async (req, res) => {
  try {
    const { reminder, downloadLink } = req.body;
    const update = {};
    if (typeof reminder === "boolean") update["notificationPreferences.reminder"] = reminder;
    if (typeof downloadLink === "boolean") update["notificationPreferences.downloadLink"] = downloadLink;

    if (Object.keys(update).length === 0) {
      return res.status(400).json(new ApiError(400, "No valid preference fields provided."));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true, select: "notificationPreferences" }
    );
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));

    return res.status(200).json(
      new ApiResponse(200, user.notificationPreferences, "Notification preferences updated.")
    );
  } catch (err) {
    console.error("updateNotificationPreferences error:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

// <-- FIX: ADD completeProfile TO THIS EXPORT LIST -->
export {
  start,
  getSession,
  getExternalInviteDetails,
  loginUser,
  logoutUser,
  registerUser,
  googleLogin,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  generatePortfolio,
  completeProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
};
