import User from "../models/user.model.js";
import Resume from "../models/resume.model.js";
import Notification from "../models/notification.model.js";
import { sendReminderEmail } from "./email.service.js";

// ─── Stage timing ────────────────────────────────────────────────────────────
//  Stage 1 : send when user has been signed up >= 10 days
//  Stage 2 : send when >= 30 days have passed since Stage 1 was sent
//  Stage 3 : send when user has been signed up >= 180 days (6 months)
//  After Stage 3, stop. If the user creates a resume at any point, stop.
// ─────────────────────────────────────────────────────────────────────────────

const daysBetween = (from, to) => (to - from) / (1000 * 60 * 60 * 24);

// ── Admin UI helpers (kept for admin notifications panel) ─────────────────────

const REMINDER_STATUS_PRIORITY = {
  pending: 0,
  failed: 1,
  sent: 2,
  cancelled: 3,
};

export const getReminderWindow = (baseDate = new Date()) => {
  const tenDaysAgo = new Date(baseDate);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  tenDaysAgo.setHours(0, 0, 0, 0);

  const elevenDaysAgo = new Date(baseDate);
  elevenDaysAgo.setDate(elevenDaysAgo.getDate() - 11);
  elevenDaysAgo.setHours(0, 0, 0, 0);

  return { startsAt: elevenDaysAgo, endsAt: tenDaysAgo };
};

const buildReminderStatus = (notifications = []) => {
  const latestNotification = notifications[0] ?? null;
  const latestSentNotification =
    notifications.find((n) => n.status === "sent") ?? null;

  if (latestNotification?.status === "cancelled") {
    return { currentStatus: "cancelled", latestNotification, latestSentNotification };
  }
  if (latestSentNotification) {
    return { currentStatus: "sent", latestNotification, latestSentNotification };
  }
  if (latestNotification?.status === "failed") {
    return { currentStatus: "failed", latestNotification, latestSentNotification: null };
  }
  return { currentStatus: "pending", latestNotification, latestSentNotification: null };
};

const buildReminderControlRow = (user, notifications = []) => {
  const { currentStatus, latestNotification, latestSentNotification } =
    buildReminderStatus(notifications);

  return {
    userId: String(user._id),
    userName: user.fullName,
    userEmail: user.email,
    createdAt: user.createdAt,
    currentStatus,
    latestNotificationId: latestNotification?._id ? String(latestNotification._id) : null,
    latestNotificationAt: latestNotification?.createdAt ?? null,
    sentAt: latestSentNotification?.createdAt ?? null,
    lastErrorMessage: currentStatus === "failed" ? latestNotification?.errorMessage ?? "" : "",
    canSend: currentStatus === "pending" || currentStatus === "failed",
    canCancel: currentStatus === "sent",
    canResend: currentStatus === "sent",
    cronEligible: currentStatus === "pending" || currentStatus === "failed",
    sortPriority: REMINDER_STATUS_PRIORITY[currentStatus] ?? 99,
  };
};

const getAdminReminderUsers = async ({ search = "", userId } = {}) => {
  const { startsAt, endsAt } = getReminderWindow();
  const filter = { createdAt: { $gte: startsAt, $lt: endsAt } };
  if (userId) filter._id = userId;
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
    ];
  }
  return User.find(filter).select("_id fullName email createdAt").sort({ createdAt: 1 }).lean();
};

const getUsersWithoutResumes = async (users) => {
  if (users.length === 0) return [];
  const userIds = users.map((u) => u._id);
  const resumeCounts = await Resume.aggregate([
    { $match: { user: { $in: userIds } } },
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);
  const usersWithResumes = new Set(
    resumeCounts.filter((e) => e.count > 0).map((e) => String(e._id))
  );
  return users.filter((u) => !usersWithResumes.has(String(u._id)));
};

const getReminderNotificationsByUser = async (userIds) => {
  if (userIds.length === 0) return new Map();
  const notifications = await Notification.find({
    userId: { $in: userIds },
    type: "reminder",
  })
    .sort({ createdAt: -1 })
    .lean();

  const map = new Map();
  for (const n of notifications) {
    const key = String(n.userId);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(n);
  }
  return map;
};

export const getReminderControlRows = async ({ search = "" } = {}) => {
  const reminderUsers = await getAdminReminderUsers({ search });
  const usersWithoutResumes = await getUsersWithoutResumes(reminderUsers);
  if (usersWithoutResumes.length === 0) return [];

  const userIds = usersWithoutResumes.map((u) => u._id);
  const notificationsByUser = await getReminderNotificationsByUser(userIds);

  return usersWithoutResumes
    .map((user) => buildReminderControlRow(user, notificationsByUser.get(String(user._id)) ?? []))
    .sort((a, b) => {
      const delta = a.sortPriority - b.sortPriority;
      return delta !== 0 ? delta : new Date(a.createdAt) - new Date(b.createdAt);
    });
};

export const getReminderControlRowByUserId = async (userId) => {
  const reminderUsers = await getAdminReminderUsers({ userId });
  const usersWithoutResumes = await getUsersWithoutResumes(reminderUsers);
  const user = usersWithoutResumes[0];
  if (!user) return null;

  const notificationsByUser = await getReminderNotificationsByUser([user._id]);
  return buildReminderControlRow(user, notificationsByUser.get(String(user._id)) ?? []);
};

// ── Cron: multi-stage reminder logic ─────────────────────────────────────────

/**
 * For a user + their reminder notification history, determine which stage
 * should be sent next (1, 2, or 3), or null if none is due yet / all done.
 */
const getNextReminderStage = (user, notifications) => {
  const now = new Date();
  const signupDate = new Date(user.createdAt);
  const daysSinceSignup = daysBetween(signupDate, now);

  // Build a map of the FIRST successfully sent notification per stage
  const sentByStage = {};
  for (const n of notifications) {
    if (n.status === "sent" && n.reminderStage && !sentByStage[n.reminderStage]) {
      sentByStage[n.reminderStage] = n;
    }
  }

  // Stage 1 not yet sent
  if (!sentByStage[1]) {
    return daysSinceSignup >= 10 ? 1 : null;
  }

  // Stage 2 not yet sent — wait 30 days after Stage 1
  if (!sentByStage[2]) {
    const daysSinceStage1 = daysBetween(new Date(sentByStage[1].createdAt), now);
    return daysSinceStage1 >= 30 ? 2 : null;
  }

  // Stage 3 not yet sent — wait until 6 months from signup
  if (!sentByStage[3]) {
    return daysSinceSignup >= 180 ? 3 : null;
  }

  // All 3 stages sent — stop
  return null;
};

/**
 * Find all users with 0 resumes who have NOT opted out of reminder emails.
 */
const getAllUsersEligibleForReminder = async () => {
  // Users who have not explicitly set reminder = false
  const candidates = await User.find({
    $or: [
      { "notificationPreferences.reminder": { $exists: false } },
      { "notificationPreferences.reminder": true },
    ],
  })
    .select("_id fullName email createdAt notificationPreferences")
    .lean();

  return getUsersWithoutResumes(candidates);
};

/**
 * Main cron entry point — processes all 3 reminder stages.
 */
export const processReminderNotifications = async () => {
  const usersWithNoResumes = await getAllUsersEligibleForReminder();

  if (usersWithNoResumes.length === 0) {
    return { sent: 0, skipped: 0, failed: 0, total: 0 };
  }

  const userIds = usersWithNoResumes.map((u) => u._id);
  // Sort ASC so earliest notifications come first (needed for stage detection)
  const allNotifications = await Notification.find({
    userId: { $in: userIds },
    type: "reminder",
  })
    .sort({ createdAt: 1 })
    .lean();

  const notificationsByUser = new Map();
  for (const n of allNotifications) {
    const key = String(n.userId);
    if (!notificationsByUser.has(key)) notificationsByUser.set(key, []);
    notificationsByUser.get(key).push(n);
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of usersWithNoResumes) {
    const notifications = notificationsByUser.get(String(user._id)) ?? [];
    const nextStage = getNextReminderStage(user, notifications);

    if (nextStage === null) {
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
      console.error(`Reminder stage ${nextStage} failed for ${user.email}:`, emailErr.message);
    }

    await Notification.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      type: "reminder",
      reminderStage: nextStage,
      status,
      errorMessage,
    }).catch((e) => console.error("Notification log failed:", e.message));
  }

  return { sent, skipped, failed, total: usersWithNoResumes.length };
};
