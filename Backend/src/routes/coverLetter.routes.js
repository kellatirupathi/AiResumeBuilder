import { Router } from "express";
import multer from "multer";
import {
  createCoverLetter,
  getAllCoverLetters,
  getCoverLetter,
  updateCoverLetter,
  removeCoverLetter,
  cloneCoverLetter,
  saveVersion,
  revertToVersion,
  generateDriveLink,
  getPublicCoverLetter,
  trackCoverLetterView,
  uploadSourceResumePdf,
} from "../controller/coverLetter.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- Public Routes ---
router.get("/public/:slugOrId", getPublicCoverLetter);
router.post("/public/view/:slugOrId", trackCoverLetterView);

// --- Authenticated Routes ---
router.post(
  "/upload-source-pdf",
  isUserAvailable,
  upload.single("pdf"),
  uploadSourceResumePdf
);
router.post("/createCoverLetter", isUserAvailable, createCoverLetter);
router.get("/getAllCoverLetters", isUserAvailable, getAllCoverLetters);
router.get("/getCoverLetter", isUserAvailable, getCoverLetter);
router.put("/updateCoverLetter", isUserAvailable, updateCoverLetter);
router.delete("/removeCoverLetter", isUserAvailable, removeCoverLetter);

router.post("/:id/clone", isUserAvailable, cloneCoverLetter);
router.post("/:id/version", isUserAvailable, saveVersion);
router.put("/:id/revert/:versionId", isUserAvailable, revertToVersion);

router.post("/generateDriveLink", isUserAvailable, generateDriveLink);

export default router;
