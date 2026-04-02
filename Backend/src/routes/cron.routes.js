import { Router } from "express";
import { sendReminders } from "../controller/cron.controller.js";

const router = Router();

// Called daily by an external scheduler (e.g. cron-job.org)
// Protected by x-cron-secret header matching CRON_SECRET env var
router.post("/send-reminders", sendReminders);

export default router;
