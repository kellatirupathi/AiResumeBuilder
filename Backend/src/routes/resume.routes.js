import { Router } from "express";
import {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
  getPublicResume,
  trackResumeView,
  cloneResume,      // <-- NEW
  saveVersion,      // <-- NEW
  revertToVersion,  // <-- NEW
} from "../controller/resume.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/", start);

// --- Public Routes (No Auth Needed) ---
router.get("/public/:resumeId", getPublicResume);
router.post("/public/view/:resumeId", trackResumeView);

// --- Authenticated Routes (User Must Be Logged In) ---
router.post("/createResume", isUserAvailable, createResume);
router.get("/getAllResume", isUserAvailable, getALLResume);
router.get("/getResume", isUserAvailable, getResume);
router.put("/updateResume", isUserAvailable, updateResume);
router.delete("/removeResume", isUserAvailable, removeResume);

// --- NEW: Cloning and Versioning Routes ---
router.post("/:id/clone", isUserAvailable, cloneResume);
router.post("/:id/version", isUserAvailable, saveVersion);
router.put("/:id/revert/:versionId", isUserAvailable, revertToVersion);

export default router;
