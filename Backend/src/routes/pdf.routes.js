import { Router } from "express";
import { generateResumePDF, generatePublicResumePDF } from "../controller/pdf.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

// Route to generate and download a PDF (Authenticated)
router.get("/download", isUserAvailable, generateResumePDF);

// Public route to view a resume PDF by ID (Unauthenticated)
router.get("/public/:resumeId", generatePublicResumePDF);

export default router;
