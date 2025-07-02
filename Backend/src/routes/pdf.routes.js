import { Router } from "express";
import { generateResumePDF } from "../controller/pdf.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

// Route to generate and download a PDF
router.get("/download", isUserAvailable, generateResumePDF);

export default router;