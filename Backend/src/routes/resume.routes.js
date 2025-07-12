import { Router } from "express";
import {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
  getPublicResume, // Import new controller
} from "../controller/resume.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/", start);

// New public route for sharing resumes
router.get("/public/:resumeId", getPublicResume);

router.post("/createResume", isUserAvailable, createResume);
router.get("/getAllResume", isUserAvailable, getALLResume);
router.get("/getResume", isUserAvailable, getResume);
router.put("/updateResume", isUserAvailable, updateResume);
router.delete("/removeResume", isUserAvailable, removeResume);

export default router;
