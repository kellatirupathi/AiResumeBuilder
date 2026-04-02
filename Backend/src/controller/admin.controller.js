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
