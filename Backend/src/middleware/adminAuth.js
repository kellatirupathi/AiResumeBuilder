import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/admin.model.js";

/**
 * Middleware to verify admin authentication.
 * Checks for a valid 'adminToken' in cookies and verifies its role.
 */
export const isAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.status(401).json(new ApiError(401, "Admin access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin || !["owner", "admin"].includes(admin.role)) {
      throw new Error("Invalid role.");
    }

    req.admin = {
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    next();
  } catch (ex) {
    return res.status(400).json(new ApiError(400, "Invalid or expired admin token."));
  }
};

export const isOwnerAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "owner") {
    return res
      .status(403)
      .json(new ApiError(403, "Owner admin access is required."));
  }

  next();
};
