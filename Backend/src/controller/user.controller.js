// C:\Users\NxtWave\Downloads\code\Backend\src\controller\user.controller.js
import mongoose from "mongoose";
import User from "../models/user.model.js";
import NiatId from "../models/niatId.model.js";
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


const start = async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
  } else {
    return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
  }
};

const registerUser = async (req, res) => {
  console.log("Registration Started");
  const { fullName, email, password, niatId } = req.body;

  if (!fullName || !email || !password || !niatId) {
    console.log("Registration Failed data insufficient");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: Full Name, NIAT ID, Email, and Password."
        )
      );
  }

  try {
    const niatIdRecord = await NiatId.findOne({ niatId: niatId });
    if (!niatIdRecord) {
        console.log(`Registration Failed: NIAT ID not found in the database - ${niatId}`);
        return res
            .status(400)
            .json(new ApiError(400, "Your NIAT ID is not registered in our system. Please crosscheck and enter the correct NIAT ID."));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Registration Failed already registered user");
      return res
        .status(409)
        .json(new ApiError(409, "User with this email already registered."));
    }

    const existingNiatId = await User.findOne({ niatId });
    if (existingNiatId) {
      console.log("Registration Failed already registered user with this NIAT ID");
      return res
        .status(409)
        .json(new ApiError(409, "This NIAT ID has already been used to create an account."));
    }

    const newUser = await User.create({
      fullName,
      niatId,
      email,
      password,
      niatIdVerified: true, 
    });

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
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
    );
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "Dev",
      sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

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
  const { credential } = req.body;
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
    let user = await User.findOne({ email });

    if (!user) {
      const password = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        fullName,
        email,
        password,
      });

      sendWelcomeEmail(user.fullName, user.email).catch(err => {
        console.error(`[Non-blocking Error] Failed to send Google welcome email to ${user.email}:`, err.message);
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
    );
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "Dev",
      sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

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
            niatIdVerified: user.niatIdVerified
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
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "Dev",
    sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
    path: "/"
  };
  
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
    const userObject = user.toObject();
    const nameParts = userObject.fullName ? userObject.fullName.split(' ') : [''];
    userObject.firstName = nameParts[0] || '';
    userObject.lastName = nameParts.slice(1).join(' ') || '';
    return res.status(200).json(new ApiResponse(200, userObject, "Profile fetched successfully."));
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
    const userObject = updatedUser.toObject();
    delete userObject.password;
    const nameParts = userObject.fullName.split(' ');
    userObject.firstName = nameParts[0] || '';
    userObject.lastName = nameParts.slice(1).join(' ') || '';
    return res.status(200).json(new ApiResponse(200, userObject, "Profile updated successfully."));
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
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.forgotPasswordToken;
    delete updatedUser.forgotPasswordTokenExpiry;
    return res.status(200).json(new ApiResponse(200, updatedUser, "Portfolio generated successfully!"));
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

    // Validate the NIAT ID
    const niatIdRecord = await NiatId.findOne({ niatId });
    if (!niatIdRecord) {
      return res.status(400).json(new ApiError(400, "This NIAT ID is not registered in our system."));
    }
    
    // Check if another user has already taken this NIAT ID
    const existingNiatUser = await User.findOne({ niatId });
    if (existingNiatUser && existingNiatUser._id.toString() !== userId.toString()) {
      return res.status(409).json(new ApiError(409, "This NIAT ID is already associated with another account."));
    }
    
    // Update the user
    user.niatId = niatId;
    user.niatIdVerified = true;
    await user.save();
    
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile completed successfully."));

  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], error.stack));
  }
};


// <-- FIX: ADD completeProfile TO THIS EXPORT LIST -->
export {
  start,
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
  completeProfile
};
