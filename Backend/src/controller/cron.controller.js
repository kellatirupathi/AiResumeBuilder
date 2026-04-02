import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { processReminderNotifications } from "../services/reminder.service.js";

/**
 * POST /api/cron/send-reminders
 * Protected by CRON_SECRET header.
 * Finds users who signed up exactly 10 days ago with 0 resumes and no prior reminder.
 * Sends one reminder email per qualifying user, logs to Notification model.
 */
export const sendReminders = async (req, res) => {
  try {
    const secret = req.headers["x-cron-secret"];
    if (!secret || secret !== process.env.CRON_SECRET) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const result = await processReminderNotifications();
    console.log(
      `Cron: reminders sent=${result.sent}, skipped=${result.skipped}, failed=${result.failed}`
    );

    return res.status(200).json(
      new ApiResponse(200, result, result.total === 0 ? "No candidates today" : "Reminders processed")
    );
  } catch (error) {
    console.error("Cron sendReminders error:", error);
    return res.status(500).json(new ApiError(500, "Cron job failed", [error.message]));
  }
};
