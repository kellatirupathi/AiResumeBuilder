import { Router } from "express";
import { generateAiContent } from "../controller/ai.controller.js";
import { attachUserIfAvailable } from "../middleware/auth.js";

const router = Router();

// Open to anonymous callers (the public ATS checker needs it); identity only
// determines which rate limit applies. See ai.controller.js.
router.post("/generate", attachUserIfAvailable, generateAiContent);

export default router;
