import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import Notification from "../models/notification.model.js";
import { sendReminderEmail } from "./email.service.js";

export const processReminderNotifications = async () => {
  // Window: users created between 10d 0h and 11d 0h ago
  const now = new Date();
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  tenDaysAgo.setHours(0, 0, 0, 0);

  const elevenDaysAgo = new Date(now);
  elevenDaysAgo.setDate(elevenDaysAgo.getDate() - 11);
  elevenDaysAgo.setHours(0, 0, 0, 0);

  const candidates = await User.find({
    createdAt: { $gte: elevenDaysAgo, $lt: tenDaysAgo },
  }).select("_id fullName email");

  if (candidates.length === 0) {
    return { sent: 0, skipped: 0, failed: 0, total: 0 };
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of candidates) {
    const alreadySent = await Notification.exists({
      userId: user._id,
      type: "reminder",
      status: "sent",
    });

    if (alreadySent) {
      skipped++;
      continue;
    }

    const resumeCount = await Resume.countDocuments({ user: user._id });
    if (resumeCount > 0) {
      skipped++;
      continue;
    }

    let status = "sent";
    let errorMessage = "";

    try {
      await sendReminderEmail(user.fullName, user.email);
      sent++;
    } catch (emailErr) {
      status = "failed";
      errorMessage = emailErr.message;
      failed++;
      console.error(`Reminder email failed for ${user.email}:`, emailErr.message);
    }

    await Notification.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      type: "reminder",
      status,
      errorMessage,
    });
  }

  return {
    sent,
    skipped,
    failed,
    total: candidates.length,
  };
};
