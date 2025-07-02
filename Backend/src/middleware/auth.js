import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const isUserAvailable = async (req, res, next) => {
  let { token } = req.cookies;
  
  console.log("Auth middleware called");
  console.log("Cookies received:", JSON.stringify(req.cookies));
  console.log("Token exists:", token ? "Yes" : "No");

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json(new ApiError(401, "Authentication required. Please log in."));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Token verified, user ID:", decodedToken.id);
    
    const user = await User.findById(decodedToken.id);

    if (!user) {
      console.log("User not found with ID:", decodedToken.id);
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    console.log("User authenticated:", user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json(new ApiError(401, "Invalid token. Please log in again."));
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json(new ApiError(401, "Token expired. Please log in again."));
    }
    return res.status(500).json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
};

export { isUserAvailable };
