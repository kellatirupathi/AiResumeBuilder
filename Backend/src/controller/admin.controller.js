import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import jwt from "jsonwebtoken";
import {
  generateAndUploadResumeDriveLink,
  processPendingResumeDriveLinks,
} from "../services/resumeDrive.service.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tirupathirao.kella@nxtwave.co.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tirupathi@0231";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "Dev",
  sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
  path: "/",
};

const USER_FIELDS = [
  "fullName",
  "email",
  "password",
  "niatId",
  "niatIdVerified",
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

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminToken = jwt.sign(
      { email: ADMIN_EMAIL, role: "admin" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .cookie("adminToken", adminToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, { email: ADMIN_EMAIL }, "Admin logged in successfully"));
  }

  return res.status(401).json(new ApiError(401, "Invalid admin credentials"));
};

export const logoutAdmin = (req, res) =>
  res
    .clearCookie("adminToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));

export const checkAdminSession = (req, res) =>
  res
    .status(200)
    .json(new ApiResponse(200, { admin: req.admin }, "Admin session is active"));

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
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { niatId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

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
        .populate("user", "fullName email niatId")
        .select("title template themeColor createdAt updatedAt viewCount googleDriveLink user")
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
    const resumes = await Resume.find({}).populate("user", "fullName email niatId");
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

    const populatedResume = await Resume.findById(createdResume._id).populate("user", "fullName email niatId");

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
    ).populate("user", "fullName email niatId");

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
