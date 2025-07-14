// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";
// import User from "../models/user.model.js";
// import Resume from "../models/resume.model.js";
// import jwt from "jsonwebtoken";

// // Predefined admin credentials stored in environment variables for security
// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tirupathirao.kella@nxtwave.co.in";
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tirupathi@0231";

// // Cookie options for secure, cross-site cookie handling
// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV !== "Dev", // Use secure cookies in production
//   sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
// };

// /**
//  * Admin Login
//  * Authenticates the admin and sets a secure cookie.
//  */
// export const loginAdmin = (req, res) => {
//   const { email, password } = req.body;

//   if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//     const adminToken = jwt.sign(
//       { email: ADMIN_EMAIL, role: "admin" },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "1d" } // Token expires in 1 day
//     );
    
//     return res
//       .cookie("adminToken", adminToken, cookieOptions)
//       .status(200)
//       .json(new ApiResponse(200, { email: ADMIN_EMAIL }, "Admin logged in successfully"));
//   } else {
//     return res.status(401).json(new ApiError(401, "Invalid admin credentials"));
//   }
// };

// /**
//  * Admin Logout
//  * Clears the admin authentication cookie.
//  */
// export const logoutAdmin = (req, res) => {
//   return res
//     .clearCookie("adminToken", cookieOptions)
//     .status(200)
//     .json(new ApiResponse(200, {}, "Admin logged out successfully"));
// };

// /**
//  * Check Admin Session
//  * Verifies if there is an active admin session.
//  */
// export const checkAdminSession = (req, res) => {
//   // The isAdmin middleware already validates the session. 
//   // If it passes, the admin is authenticated.
//   return res.status(200).json(new ApiResponse(200, { admin: req.admin }, "Admin session is active"));
// };


// /**
//  * Get All Users
//  * Fetches all registered users, excluding their passwords.
//  */
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password");
//     return res
//       .status(200)
//       .json(new ApiResponse(200, users, "All users fetched successfully"));
//   } catch (error) {
//     return res
//       .status(500)
//       .json(new ApiError(500, "Failed to fetch users", [], error.stack));
//   }
// };

// /**
//  * Get All Resumes
//  * Fetches all resumes and populates the associated user's name and email.
//  */
// export const getAllResumes = async (req, res) => {
//   try {
//     const resumes = await Resume.find({}).populate(
//       "user",
//       "fullName email" // Populate only fullName and email
//     );
//     return res
//       .status(200)
//       .json(new ApiResponse(200, resumes, "All resumes fetched successfully"));
//   } catch (error) {
//     return res
//       .status(500)
//       .json(new ApiError(500, "Failed to fetch resumes", [], error.stack));
//   }
// };


import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import jwt from "jsonwebtoken";

// Predefined admin credentials stored in environment variables for security
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tirupathirao.kella@nxtwave.co.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Tirupathi@0231";

// Cookie options for secure, cross-site cookie handling
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "Dev", // Use secure cookies in production
  sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
};

/**
 * Admin Login
 * Authenticates the admin and sets a secure cookie.
 */
export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminToken = jwt.sign(
      { email: ADMIN_EMAIL, role: "admin" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // Token expires in 1 day
    );
    
    return res
      .cookie("adminToken", adminToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, { email: ADMIN_EMAIL }, "Admin logged in successfully"));
  } else {
    return res.status(401).json(new ApiError(401, "Invalid admin credentials"));
  }
};

/**
 * Admin Logout
 * Clears the admin authentication cookie.
 */
export const logoutAdmin = (req, res) => {
  return res
    .clearCookie("adminToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
};

/**
 * Check Admin Session
 * Verifies if there is an active admin session.
 */
export const checkAdminSession = (req, res) => {
  // The isAdmin middleware already validates the session. 
  // If it passes, the admin is authenticated.
  return res.status(200).json(new ApiResponse(200, { admin: req.admin }, "Admin session is active"));
};


/**
 * Get All Users
 * Fetches all registered users, excluding their passwords.
 */
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

/**
 * Get All Resumes
 * Fetches all resumes and populates the associated user's name, email, and NIAT ID.
 */
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({}).populate(
      "user",
      "fullName email niatId" // Populate fullName, email, and niatId
    );
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "All resumes fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch resumes", [], error.stack));
  }
};
