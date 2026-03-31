import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  checkAdminSession,
  getAllUsers,
  getAllResumes,
  processPendingResumeLinks,
} from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = Router();

// --- Public Admin Routes ---
router.post("/login", loginAdmin);

// --- Protected Admin Routes (require admin token) ---
router.use(isAdmin);

router.get("/session", checkAdminSession);
router.post("/logout", logoutAdmin);
router.get("/users", getAllUsers);
router.get("/resumes", getAllResumes);
router.post("/resumes/process-pending-links", processPendingResumeLinks);

export default router;
