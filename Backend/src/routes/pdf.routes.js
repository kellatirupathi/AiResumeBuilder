import { Router } from "express";
import {
  generateResumePDF,
  generatePublicResumePDF,
  generateCoverLetterPDF,
  generatePublicCoverLetterPDF,
  generatePublicCoverLetterPDFDirect,
} from "../controller/pdf.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

// Resume PDF
router.get("/download", isUserAvailable, generateResumePDF);
router.get("/public/:resumeId", generatePublicResumePDF);

// Cover Letter PDF
router.get("/cover-letter/download", isUserAvailable, generateCoverLetterPDF);
router.get("/cover-letter/public/:slugOrId", generatePublicCoverLetterPDF);
// Direct on-the-fly PDF for public requests (no Drive required)
router.get("/cover-letter/public-direct/:slugOrId", generatePublicCoverLetterPDFDirect);

export default router;
