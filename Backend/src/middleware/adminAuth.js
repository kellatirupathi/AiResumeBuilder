import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to verify admin authentication.
 * Checks for a valid 'adminToken' in cookies and verifies its role.
 */
export const isAdmin = (req, res, next) => {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.status(401).json(new ApiError(401, "Admin access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);
    
    // Ensure the token has the admin role
    if (decoded.role !== "admin") {
      throw new Error("Invalid role.");
    }
    
    // Attach admin info to the request object
    req.admin = decoded;
    next();
  } catch (ex) {
    return res.status(400).json(new ApiError(400, "Invalid or expired admin token."));
  }
};
