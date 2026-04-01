import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  checkAdminSession,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllResumes,
  createResume,
  updateResume,
  deleteResume,
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
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/resumes", getAllResumes);
router.post("/resumes", createResume);
router.put("/resumes/:id", updateResume);
router.delete("/resumes/:id", deleteResume);
router.post("/resumes/process-pending-links", processPendingResumeLinks);

export default router;
