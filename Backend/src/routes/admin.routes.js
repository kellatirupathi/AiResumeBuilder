import { Router } from "express";
import {
  loginAdmin,
  createExternalInvite,
  deleteExternalInvite,
  getExternalInviteById,
  getExternalInvites,
  getExternalUsers,
  getAdminInviteDetails,
  setAdminPasswordFromInvite,
  logoutAdmin,
  checkAdminSession,
  getAdminAccounts,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  getAllUsers,
  getUsersPaginated,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllResumes,
  getResumesPaginated,
  getResumesByUser,
  getDashboardStats,
  createResume,
  updateResume,
  deleteResume,
  processPendingResumeLinks,
  updateExternalInvite,
  getAllCoverLetters,
  getCoverLettersPaginated,
  getCoverLettersByUser,
  getCoverLetterById,
  deleteCoverLetter,
  processPendingCoverLetterLinks,
} from "../controller/admin.controller.js";
import {
  getNotifications,
  resendNotification,
  cancelNotification,
  sendReminderNotification,
  cancelReminderNotification,
} from "../controller/notification.controller.js";
import { isAdmin, isOwnerAdmin } from "../middleware/adminAuth.js";

const router = Router();

// --- Public Admin Routes ---
router.post("/login", loginAdmin);
router.get("/invite", getAdminInviteDetails);
router.post("/set-password", setAdminPasswordFromInvite);

// --- Protected Admin Routes (require admin token) ---
router.use(isAdmin);

router.get("/session", checkAdminSession);
router.post("/logout", logoutAdmin);
router.get("/accounts", isOwnerAdmin, getAdminAccounts);
router.post("/accounts", isOwnerAdmin, createAdminAccount);
router.put("/accounts/:id", isOwnerAdmin, updateAdminAccount);
router.delete("/accounts/:id", isOwnerAdmin, deleteAdminAccount);
router.get("/stats", getDashboardStats);
router.get("/external-invites", getExternalInvites);
router.get("/external-invites/:id", getExternalInviteById);
router.post("/external-invites", createExternalInvite);
router.put("/external-invites/:id", updateExternalInvite);
router.delete("/external-invites/:id", deleteExternalInvite);
router.get("/external-users", getExternalUsers);
router.get("/users", getAllUsers);
router.get("/users/paginated", getUsersPaginated);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/resumes", getAllResumes);
router.get("/resumes/paginated", getResumesPaginated);
router.get("/resumes/by-user/:userId", getResumesByUser);
router.post("/resumes", createResume);
router.put("/resumes/:id", updateResume);
router.delete("/resumes/:id", deleteResume);
router.post("/resumes/process-pending-links", processPendingResumeLinks);

// Cover Letters
router.get("/cover-letters", getAllCoverLetters);
router.get("/cover-letters/paginated", getCoverLettersPaginated);
router.get("/cover-letters/by-user/:userId", getCoverLettersByUser);
router.get("/cover-letters/:id", getCoverLetterById);
router.delete("/cover-letters/:id", deleteCoverLetter);
router.post(
  "/cover-letters/process-pending-links",
  processPendingCoverLetterLinks
);

// Notification routes
router.get("/notifications", getNotifications);
router.post("/notifications/reminders/:userId/send", sendReminderNotification);
router.patch(
  "/notifications/reminders/:userId/cancel",
  cancelReminderNotification
);
router.post("/notifications/:id/resend", resendNotification);
router.patch("/notifications/:id/cancel", cancelNotification);

export default router;
