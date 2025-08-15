// C:\Users\NxtWave\Downloads\code\Backend\src\routes\user.routes.js
import {
  start,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset, // MODIFIED
  resetPassword,        // MODIFIED
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../controller/user.controller.js";
import { Router } from "express";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/", isUserAvailable, start);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isUserAvailable, logoutUser);
router.post("/forgot-password", requestPasswordReset); // MODIFIED: Renamed for clarity, now points to request function
router.post("/reset-password", resetPassword);       // ADDED: Handles token-based password reset
router.post("/change-password", isUserAvailable, changePassword);

// --- NEW PROFILE ROUTES ---
router.get("/profile", isUserAvailable, getUserProfile);
router.put("/profile", isUserAvailable, updateUserProfile);

export default router;
