import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import Admin from "../models/admin.model.js";
import ExternalInvite from "../models/externalInvite.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  generateAndUploadResumeDriveLink,
  processPendingResumeDriveLinks,
} from "../services/resumeDrive.service.js";
import { sendAdminInviteEmail } from "../services/email.service.js";
import {
  getAdminTokenExpiry,
  getClearCookieOptions,
  getCookieOptions,
} from "../utils/authSession.js";

const cookieOptions = getCookieOptions();
const clearCookieOptions = getClearCookieOptions();

const USER_FIELDS = [
  "fullName",
  "email",
  "password",
  "niatId",
  "niatIdVerified",
  "userType",
  "authProvider",
  "externalInvite",
  "jobTitle",
  "address",
  "phone",
  "summary",
  "githubUrl",
  "linkedinUrl",
  "portfolioUrl",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "additionalSections",
];

const RESUME_FIELDS = [
  "user",
  "title",
  "themeColor",
  "template",
  "firstName",
  "lastName",
  "email",
  "summary",
  "jobTitle",
  "phone",
  "address",
  "githubUrl",
  "linkedinUrl",
  "portfolioUrl",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "additionalSections",
  "viewCount",
];

const ADMIN_FIELDS = ["name", "email", "password", "role"];
const EXTERNAL_USER_FIELDS = [
  "_id",
  "fullName",
  "email",
  "userType",
  "authProvider",
  "niatId",
  "niatIdVerified",
  "createdAt",
  "externalInvite",
];

const pickDefinedFields = (source, allowedFields) => {
  const result = {};

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field) && source[field] !== undefined) {
      result[field] = source[field];
    }
  });

  return result;
};

const stripPasswordField = (userDocument) => {
  const userObject = userDocument?.toObject ? userDocument.toObject() : userDocument;

  if (!userObject) {
    return userObject;
  }

  delete userObject.password;
  delete userObject.forgotPasswordToken;
  delete userObject.forgotPasswordTokenExpiry;

  return userObject;
};

const sanitizeAdmin = (adminDocument) => {
  const adminObject = adminDocument?.toObject ? adminDocument.toObject() : adminDocument;

  if (!adminObject) {
    return adminObject;
  }

  delete adminObject.password;
  delete adminObject.inviteToken;
  delete adminObject.inviteTokenExpiry;

  return adminObject;
};

const hashInviteToken = (token) =>
  crypto.createHash("sha256").update(String(token || "")).digest("hex");

const getInviteStatus = (invite) => {
  if (!invite) {
    return "expired";
  }

  if (invite.status === "revoked") {
    return "revoked";
  }

  if (invite.expiresAt && invite.expiresAt <= new Date()) {
    return "expired";
  }

  return invite.status || "active";
};

const serializeInvite = (inviteDocument) => {
  const invite = inviteDocument?.toObject ? inviteDocument.toObject() : inviteDocument;

  if (!invite) {
    return null;
  }

  return {
    ...invite,
    status: getInviteStatus(invite),
    inviteLink: `${process.env.ALLOWED_SITE}/auth/sign-in?invite=${invite.code}`,
  };
};

const signAdminToken = (admin) =>
  jwt.sign(
    {
      adminId: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: getAdminTokenExpiry() }
  );

const PROFILE_COMPLETION_BUCKETS = [
  { label: "0-25%", min: 0, max: 25 },
  { label: "26-50%", min: 26, max: 50 },
  { label: "51-75%", min: 51, max: 75 },
  { label: "76-100%", min: 76, max: 100 },
];

const PROFILE_COMPLETION_FIELDS = [
  { key: "fullName", type: "text" },
  { key: "email", type: "text" },
  { key: "phone", type: "text" },
  { key: "jobTitle", type: "text" },
  { key: "address", type: "text" },
  { key: "githubUrl", type: "text" },
  { key: "linkedinUrl", type: "text" },
  { key: "portfolioUrl", type: "text" },
  { key: "summary", type: "text" },
  { key: "skills", type: "array", meaningfulFields: ["name"] },
  { key: "experience", type: "array", meaningfulFields: ["title", "companyName", "workSummary"] },
  { key: "education", type: "array", meaningfulFields: ["universityName", "degree", "major", "description"] },
  { key: "projects", type: "array", meaningfulFields: ["projectName", "techStack", "projectSummary", "githubLink", "deployedLink"] },
  { key: "certifications", type: "array", meaningfulFields: ["name", "issuer", "credentialLink"] },
  { key: "additionalSections", type: "array", meaningfulFields: ["content"] },
];

const PROFILE_COMPLETION_PROJECTION = PROFILE_COMPLETION_FIELDS.map(({ key }) => key).join(" ");

const hasFilledText = (value) => typeof value === "string" && value.trim().length > 0;

const hasFilledArrayEntry = (value, meaningfulFields = []) => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.some((item) => {
    if (!item) {
      return false;
    }

    if (typeof item !== "object") {
      return hasFilledText(item);
    }

    const valuesToInspect = meaningfulFields.length
      ? meaningfulFields.map((field) => item[field])
      : Object.values(item);

    return valuesToInspect.some((entry) => {
      if (typeof entry === "string") {
        return entry.trim().length > 0;
      }

      if (typeof entry === "number") {
        return entry > 0;
      }

      if (typeof entry === "boolean") {
        return entry;
      }

      if (Array.isArray(entry)) {
        return entry.length > 0;
      }

      return Boolean(entry);
    });
  });
};

const calculateProfileCompletion = (user = {}) => {
  const completedFields = PROFILE_COMPLETION_FIELDS.reduce((count, field) => {
    if (field.type === "array") {
      return count + (hasFilledArrayEntry(user[field.key], field.meaningfulFields) ? 1 : 0);
    }

    return count + (hasFilledText(user[field.key]) ? 1 : 0);
  }, 0);

  return Math.round((completedFields / PROFILE_COMPLETION_FIELDS.length) * 100);
};

const buildProfileCompletionStats = (users = []) => {
  const buckets = PROFILE_COMPLETION_BUCKETS.map((bucket) => ({ ...bucket, count: 0 }));
  let totalCompletion = 0;

  users.forEach((user) => {
    const completion = calculateProfileCompletion(user);
    totalCompletion += completion;

    const bucket = buckets.find(({ min, max }) => completion >= min && completion <= max);
    if (bucket) {
      bucket.count += 1;
    }
  });

  return {
    averageProfileCompletion: users.length ? Math.round(totalCompletion / users.length) : 0,
    profileCompletionDist: buckets.map(({ label, count }) => ({ _id: label, count })),
  };
};

const generateAndUpload = async (resume) => {
  try {
    await generateAndUploadResumeDriveLink(resume);
    console.log(`Saved Google Drive link for admin-managed resume: ${resume._id}`);
  } catch (error) {
    console.error(`Failed to generate or upload PDF for admin-managed resume ${resume._id}:`, error);
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json(new ApiError(401, "Invalid admin credentials"));
    }

    const isPasswordValid = await admin.comparePassword(password || "");

    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, "Invalid admin credentials"));
    }

    const adminToken = signAdminToken(admin);

    return res
      .cookie("adminToken", adminToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { admin: sanitizeAdmin(admin) },
          "Admin logged in successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to login admin", [error.message], error.stack));
  }
};

export const logoutAdmin = (req, res) =>
  res
    .clearCookie("adminToken", clearCookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));

export const checkAdminSession = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-password -inviteToken -inviteTokenExpiry");

    if (!admin) {
      return res.status(401).json(new ApiError(401, "Admin session is invalid."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { admin }, "Admin session is active"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to validate admin session", [], error.stack));
  }
};

export const getAdminAccounts = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select("-password -inviteToken -inviteTokenExpiry")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, admins, "Admin accounts fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch admin accounts", [], error.stack));
  }
};

export const createAdminAccount = async (req, res) => {
  try {
    const payload = pickDefinedFields(req.body, ADMIN_FIELDS);
    payload.email = String(payload.email || "").trim().toLowerCase();
    payload.name = String(payload.name || "").trim();

    if (!payload.name || !payload.email) {
      return res
        .status(400)
        .json(new ApiError(400, "Name and email are required."));
    }

    if (!["owner", "admin"].includes(payload.role)) {
      return res
        .status(400)
        .json(new ApiError(400, "Role must be either owner or admin."));
    }

    const existingAdmin = await Admin.findOne({ email: payload.email });
    if (existingAdmin) {
      return res
        .status(409)
        .json(new ApiError(409, "An admin with this email already exists."));
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const hashedInviteToken = crypto.createHash("sha256").update(inviteToken).digest("hex");

    const createdAdmin = await Admin.create({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      inviteToken: hashedInviteToken,
      inviteTokenExpiry: Date.now() + 15 * 60 * 1000,
    });

    const inviteLink = `${process.env.ALLOWED_SITE}/admin/set-password?token=${inviteToken}`;
    await sendAdminInviteEmail(createdAdmin.name, createdAdmin.email, inviteLink, createdAdmin.role);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          sanitizeAdmin(createdAdmin),
          "Admin account created and invite email sent successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create admin account", [error.message], error.stack));
  }
};

export const getAdminInviteDetails = async (req, res) => {
  try {
    const token = String(req.query.token || "");

    if (!token) {
      return res.status(400).json(new ApiError(400, "Invite token is required."));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      inviteToken: hashedToken,
      inviteTokenExpiry: { $gt: Date.now() },
    }).select("name email role");

    if (!admin) {
      return res.status(400).json(new ApiError(400, "This invite link is invalid or has expired."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, admin, "Admin invite is valid."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to validate admin invite", [], error.stack));
  }
};

export const setAdminPasswordFromInvite = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json(new ApiError(400, "All fields are required."));
    }

    if (password !== confirmPassword) {
      return res.status(400).json(new ApiError(400, "Passwords do not match."));
    }

    if (password.length < 6) {
      return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long."));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      inviteToken: hashedToken,
      inviteTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json(new ApiError(400, "This invite link is invalid or has expired."));
    }

    admin.password = password;
    admin.inviteToken = undefined;
    admin.inviteTokenExpiry = undefined;
    await admin.save();

    const adminToken = signAdminToken(admin);

    return res
      .cookie("adminToken", adminToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { admin: sanitizeAdmin(admin) },
          "Admin password set successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to set admin password", [error.message], error.stack));
  }
};

export const createExternalInvite = async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const expiresAtInput = req.body.expiresAt;
    const expiresAt = expiresAtInput ? new Date(expiresAtInput) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (!title) {
      return res.status(400).json(new ApiError(400, "Invite title is required."));
    }

    if (Number.isNaN(expiresAt.getTime())) {
      return res.status(400).json(new ApiError(400, "A valid expiry date is required."));
    }

    if (expiresAt <= new Date()) {
      return res.status(400).json(new ApiError(400, "Expiry date must be in the future."));
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashInviteToken(rawToken);

    const invite = await ExternalInvite.create({
      title,
      tokenHash,
      code: rawToken,
      createdBy: req.admin.adminId,
      expiresAt,
      status: "active",
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        serializeInvite(invite),
        "External invite link created successfully."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create external invite link", [error.message], error.stack));
  }
};

export const getExternalInvites = async (req, res) => {
  try {
    const invites = await ExternalInvite.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(
      new ApiResponse(
        200,
        invites.map(serializeInvite),
        "External invite links fetched successfully."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch external invite links", [], error.stack));
  }
};

export const getExternalInviteById = async (req, res) => {
  try {
    const invite = await ExternalInvite.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!invite) {
      return res.status(404).json(new ApiError(404, "External invite link not found."));
    }

    const invitedUsers = await User.find({ externalInvite: invite._id })
      .select(EXTERNAL_USER_FIELDS.join(" "))
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          invite: serializeInvite(invite),
          invitedUsers,
        },
        "External invite details fetched successfully."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch external invite details", [], error.stack));
  }
};

export const getExternalUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: "external" })
      .populate("externalInvite", "code expiresAt createdAt status openCount signupCount")
      .select(EXTERNAL_USER_FIELDS.join(" "))
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, users, "External invited users fetched successfully.")
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch external invited users", [], error.stack));
  }
};

export const updateExternalInvite = async (req, res) => {
  try {
    const invite = await ExternalInvite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json(new ApiError(404, "External invite link not found."));
    }

    const { expiresAt, status, title } = req.body;

    if (title !== undefined) {
      const normalizedTitle = String(title || "").trim();

      if (!normalizedTitle) {
        return res.status(400).json(new ApiError(400, "Invite title is required."));
      }

      invite.title = normalizedTitle;
    }

    if (expiresAt !== undefined) {
      const parsedExpiresAt = new Date(expiresAt);
      if (Number.isNaN(parsedExpiresAt.getTime())) {
        return res.status(400).json(new ApiError(400, "A valid expiry date is required."));
      }
      invite.expiresAt = parsedExpiresAt;
    }

    if (status !== undefined) {
      if (!["active", "revoked", "expired", "used"].includes(status)) {
        return res.status(400).json(new ApiError(400, "Invalid invite status."));
      }
      invite.status = status;
    }

    await invite.save();

    return res.status(200).json(
      new ApiResponse(200, serializeInvite(invite), "External invite updated successfully.")
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update external invite", [error.message], error.stack));
  }
};

export const deleteExternalInvite = async (req, res) => {
  try {
    const invite = await ExternalInvite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json(new ApiError(404, "External invite link not found."));
    }

    const linkedUsersCount = await User.countDocuments({ externalInvite: invite._id });
    if (linkedUsersCount > 0) {
      return res.status(400).json(
        new ApiError(400, "This invite already has registered users. Revoke it instead of deleting.")
      );
    }

    await ExternalInvite.findByIdAndDelete(invite._id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "External invite deleted successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete external invite", [error.message], error.stack));
  }
};

export const updateAdminAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json(new ApiError(404, "Admin account not found."));
    }

    const payload = pickDefinedFields(req.body, ADMIN_FIELDS);

    if (payload.email !== undefined) {
      payload.email = String(payload.email || "").trim().toLowerCase();
      const existingAdmin = await Admin.findOne({ email: payload.email, _id: { $ne: id } });
      if (existingAdmin) {
        return res
          .status(409)
          .json(new ApiError(409, "An admin with this email already exists."));
      }
    }

    if (payload.name !== undefined) {
      payload.name = String(payload.name || "").trim();
    }

    if (payload.role !== undefined && !["owner", "admin"].includes(payload.role)) {
      return res
        .status(400)
        .json(new ApiError(400, "Role must be either owner or admin."));
    }

    if (payload.password === "") {
      delete payload.password;
    }

    if (
      admin.role === "owner" &&
      payload.role === "admin" &&
      String(admin._id) === String(req.admin.adminId)
    ) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot remove your own owner access."));
    }

    if (admin.role === "owner" && payload.role === "admin") {
      const ownerCount = await Admin.countDocuments({ role: "owner" });
      if (ownerCount <= 1) {
        return res
          .status(400)
          .json(new ApiError(400, "At least one owner admin must remain."));
      }
    }

    Object.assign(admin, payload);
    const updatedAdmin = await admin.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sanitizeAdmin(updatedAdmin),
          "Admin account updated successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update admin account", [error.message], error.stack));
  }
};

export const deleteAdminAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json(new ApiError(404, "Admin account not found."));
    }

    if (String(admin._id) === String(req.admin.adminId)) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot delete your own admin account."));
    }

    if (admin.role === "owner") {
      const ownerCount = await Admin.countDocuments({ role: "owner" });
      if (ownerCount <= 1) {
        return res
          .status(400)
          .json(new ApiError(400, "At least one owner admin must remain."));
      }
    }

    await Admin.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Admin account deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete admin account", [error.message], error.stack));
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - (days - 1));
    periodStart.setHours(0, 0, 0, 0);

    const [profileUsers, totalResumes, newUsersToday, newResumesToday, usersWithResumes, templateDist, userGrowth, resumeGrowth] = await Promise.all([
      User.find({}, PROFILE_COMPLETION_PROJECTION).lean(),
      Resume.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      Resume.countDocuments({ createdAt: { $gte: today } }),
      Resume.distinct("user").then((ids) => ids.length),
      Resume.aggregate([
        { $group: { _id: { $ifNull: ["$template", "unknown"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Resume.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalUsers = profileUsers.length;
    const {
      averageProfileCompletion,
      profileCompletionDist,
    } = buildProfileCompletionStats(profileUsers);
    const avgResumesPerUser = totalUsers ? (totalResumes / totalUsers).toFixed(1) : 0;
    const completionRate = totalUsers ? Math.round((usersWithResumes / totalUsers) * 100) : 0;

    return res.status(200).json(new ApiResponse(200, {
      totalUsers,
      totalResumes,
      newUsersToday,
      newResumesToday,
      usersWithResumes,
      avgResumesPerUser,
      completionRate,
      averageProfileCompletion,
      profileCompletionDist,
      profileCompletionFieldCount: PROFILE_COMPLETION_FIELDS.length,
      templateDist,
      userGrowth,
      resumeGrowth,
      days,
    }, "Dashboard stats fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch dashboard stats", [], error.stack));
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch users", [], error.stack));
  }
};

export const getUsersPaginated = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const search = req.query.search || "";
    const niatIdVerified = req.query.niatIdVerified || "";
    const reminderEnabled = req.query.reminderEnabled || "";
    const downloadLinkEnabled = req.query.downloadLinkEnabled || "";
    const createdFrom = req.query.createdFrom || "";
    const createdTo = req.query.createdTo || "";
    const resumeCountMin = req.query.resumeCountMin;
    const resumeCountMax = req.query.resumeCountMax;
    const skip = (page - 1) * limit;

    const baseMatch = {};

    if (search) {
      baseMatch.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { niatId: { $regex: search, $options: "i" } },
      ];
    }

    if (niatIdVerified === "true") {
      baseMatch.niatIdVerified = true;
    } else if (niatIdVerified === "false") {
      baseMatch.niatIdVerified = false;
    }

    if (reminderEnabled === "true") {
      baseMatch.$and = [
        ...(baseMatch.$and || []),
        {
          $or: [
            { "notificationPreferences.reminder": { $exists: false } },
            { "notificationPreferences.reminder": true },
          ],
        },
      ];
    } else if (reminderEnabled === "false") {
      baseMatch["notificationPreferences.reminder"] = false;
    }

    if (downloadLinkEnabled === "true") {
      baseMatch.$and = [
        ...(baseMatch.$and || []),
        {
          $or: [
            { "notificationPreferences.downloadLink": { $exists: false } },
            { "notificationPreferences.downloadLink": true },
          ],
        },
      ];
    } else if (downloadLinkEnabled === "false") {
      baseMatch["notificationPreferences.downloadLink"] = false;
    }

    if (createdFrom || createdTo) {
      const createdAtFilter = {};

      if (createdFrom) {
        const fromDate = new Date(createdFrom);
        if (!Number.isNaN(fromDate.getTime())) {
          createdAtFilter.$gte = fromDate;
        }
      }

      if (createdTo) {
        const toDate = new Date(createdTo);
        if (!Number.isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          createdAtFilter.$lte = toDate;
        }
      }

      if (Object.keys(createdAtFilter).length) {
        baseMatch.createdAt = createdAtFilter;
      }
    }

    const resumeCountMatch = {};
    const parsedResumeCountMin = Number.parseInt(resumeCountMin, 10);
    const parsedResumeCountMax = Number.parseInt(resumeCountMax, 10);

    if (Number.isFinite(parsedResumeCountMin)) {
      resumeCountMatch.$gte = parsedResumeCountMin;
    }

    if (Number.isFinite(parsedResumeCountMax)) {
      resumeCountMatch.$lte = parsedResumeCountMax;
    }

    const pipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: "resumes",
          localField: "_id",
          foreignField: "user",
          as: "userResumes",
        },
      },
      {
        $addFields: {
          resumeCount: { $size: "$userResumes" },
        },
      },
      ...(Object.keys(resumeCountMatch).length ? [{ $match: { resumeCount: resumeCountMatch } }] : []),
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          users: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                password: 0,
                forgotPasswordToken: 0,
                forgotPasswordTokenExpiry: 0,
                userResumes: 0,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await User.aggregate(pipeline);
    const users = result?.users || [];
    const total = result?.totalCount?.[0]?.count || 0;

    return res.status(200).json(new ApiResponse(200, {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, "Users fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch users", [], error.stack));
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));
    const resumes = await Resume.find({ user: user._id }).select("title themeColor template createdAt updatedAt viewCount googleDriveLink");
    return res.status(200).json(new ApiResponse(200, { user, resumes }, "User fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch user", [], error.stack));
  }
};

export const getResumesPaginated = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const userFilter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : null;

    let userIds = null;
    if (userFilter) {
      const matchedUsers = await User.find(userFilter).select("_id");
      userIds = matchedUsers.map((u) => u._id);
    }

    const resumeFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            ...(userIds ? [{ user: { $in: userIds } }] : []),
          ],
        }
      : {};

    const [resumes, total] = await Promise.all([
      Resume.find(resumeFilter)
        .populate("user", "fullName email niatId userType externalInvite")
        .select("title template themeColor createdAt updatedAt viewCount googleDriveLink driveOutOfSync user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Resume.countDocuments(resumeFilter),
    ]);

    return res.status(200).json(new ApiResponse(200, {
      resumes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, "Resumes fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch resumes", [], error.stack));
  }
};

export const getResumesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json(new ApiError(404, "User not found."));
    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, { user, resumes }, "User resumes fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to fetch user resumes", [], error.stack));
  }
};

export const createUser = async (req, res) => {
  try {
    const payload = pickDefinedFields(req.body, USER_FIELDS);

    if (!payload.fullName || !payload.email || !payload.password) {
      return res
        .status(400)
        .json(new ApiError(400, "Full name, email, and password are required."));
    }

    const existingEmailUser = await User.findOne({ email: payload.email });
    if (existingEmailUser) {
      return res.status(409).json(new ApiError(409, "A user with this email already exists."));
    }

    if (payload.niatId) {
      const existingNiatUser = await User.findOne({ niatId: payload.niatId });
      if (existingNiatUser) {
        return res.status(409).json(new ApiError(409, "A user with this Student ID already exists."));
      }
    }

    const createdUser = await User.create(payload);

    return res
      .status(201)
      .json(new ApiResponse(201, stripPasswordField(createdUser), "User created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create user", [error.message], error.stack));
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const payload = pickDefinedFields(req.body, USER_FIELDS);

    if (payload.email && payload.email !== user.email) {
      const existingEmailUser = await User.findOne({ email: payload.email, _id: { $ne: id } });
      if (existingEmailUser) {
        return res.status(409).json(new ApiError(409, "A user with this email already exists."));
      }
    }

    if (payload.niatId && payload.niatId !== user.niatId) {
      const existingNiatUser = await User.findOne({ niatId: payload.niatId, _id: { $ne: id } });
      if (existingNiatUser) {
        return res.status(409).json(new ApiError(409, "A user with this Student ID already exists."));
      }
    }

    if (payload.password === "") {
      delete payload.password;
    }

    Object.assign(user, payload);

    const updatedUser = await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, stripPasswordField(updatedUser), "User updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update user", [error.message], error.stack));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const deletedResumeResult = await Resume.deleteMany({ user: user._id });
    await User.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        { deletedResumes: deletedResumeResult.deletedCount || 0 },
        "User deleted successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete user", [error.message], error.stack));
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({}).populate("user", "fullName email niatId userType externalInvite");
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "All resumes fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch resumes", [], error.stack));
  }
};

export const createResume = async (req, res) => {
  try {
    const payload = pickDefinedFields(req.body, RESUME_FIELDS);

    if (!payload.title || !payload.themeColor || !payload.user) {
      return res
        .status(400)
        .json(new ApiError(400, "Title, theme color, and user are required."));
    }

    const user = await User.findById(payload.user);
    if (!user) {
      return res.status(404).json(new ApiError(404, "Selected user not found."));
    }

    const createdResume = await Resume.create({
      firstName: "",
      lastName: "",
      email: "",
      summary: "",
      jobTitle: "",
      phone: "",
      address: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      additionalSections: [],
      ...payload,
    });

    generateAndUpload(createdResume);

    const populatedResume = await Resume.findById(createdResume._id).populate("user", "fullName email niatId userType externalInvite");

    return res
      .status(201)
      .json(new ApiResponse(201, populatedResume, "Resume created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create resume", [error.message], error.stack));
  }
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = pickDefinedFields(req.body, RESUME_FIELDS);

    if (payload.user) {
      const user = await User.findById(payload.user);
      if (!user) {
        return res.status(404).json(new ApiError(404, "Selected user not found."));
      }
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { $set: payload, $currentDate: { updatedAt: true } },
      { new: true }
    ).populate("user", "fullName email niatId userType externalInvite");

    if (!updatedResume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

    generateAndUpload(updatedResume);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to update resume", [error.message], error.stack));
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);

    if (!deletedResume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Resume deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to delete resume", [error.message], error.stack));
  }
};

export const processPendingResumeLinks = async (req, res) => {
  try {
    const summary = await processPendingResumeDriveLinks();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          summary,
          "Pending resume Drive links processed successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Failed to process pending resume Drive links",
          [error.message],
          error.stack
        )
      );
  }
};
