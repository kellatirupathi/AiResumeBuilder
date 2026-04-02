// C:\Users\NxtWave\Downloads\code\Backend\src\routes\user.routes.js
import {
  start,
  getSession,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  generatePortfolio,
  googleLogin,
  completeProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../controller/user.controller.js";
import { Router } from "express";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/session", getSession);
router.get("/", isUserAvailable, start);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/logout", isUserAvailable, logoutUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", isUserAvailable, changePassword);

// --- PROFILE ROUTES ---
router.get("/profile", isUserAvailable, getUserProfile);
router.put("/profile", isUserAvailable, updateUserProfile);
router.post("/profile/generate-portfolio", isUserAvailable, generatePortfolio);

// <-- MODIFIED: ADDED NEW ROUTE -->
router.post("/complete-profile", isUserAvailable, completeProfile);

// --- NOTIFICATION PREFERENCE ROUTES ---
router.get("/notification-preferences", isUserAvailable, getNotificationPreferences);
router.patch("/notification-preferences", isUserAvailable, updateNotificationPreferences);

export default router;
