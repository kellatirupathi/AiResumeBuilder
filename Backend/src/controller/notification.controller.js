import Notification from "../models/notification.model.js";
import { sendReminderEmail, sendDriveLinkEmail } from "../services/email.service.js";
import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";
import {
  getReminderControlRowByUserId,
  getReminderControlRows,
} from "../services/reminder.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const STAGE_NUMBERS = [1, 2, 3];

const buildStageSnapshot = () => ({
  status: "pending",
  sentAt: null,
  errorMessage: "",
});

const buildReminderSummary = (notification) => ({
  id: `reminder:${notification.userId}`,
  key: `reminder:${notification.userId}`,
  latestNotificationId: String(notification._id),
  userId: String(notification.userId),
  userName: notification.userName || "",
  userEmail: notification.userEmail || "",
  type: "reminder",
  resumeTitle: "",
  currentStatus: notification.status,
  lastError: notification.errorMessage || "",
  signupAt: null,
  latestActivityAt: notification.createdAt,
  actions: {
    canResend: notification.status !== "cancelled",
    canCancel: notification.status !== "cancelled",
  },
  stages: {
    1: buildStageSnapshot(),
    2: buildStageSnapshot(),
    3: buildStageSnapshot(),
  },
});

const buildDownloadLinkSummary = (notification) => ({
  id: `download-link:${notification.resumeId || notification._id}`,
  key: `download-link:${notification.resumeId || notification._id}`,
  latestNotificationId: String(notification._id),
  userId: String(notification.userId),
  userName: notification.userName || "",
  userEmail: notification.userEmail || "",
  type: "download-link",
  resumeTitle: notification.resumeTitle || "",
  currentStatus: notification.status,
  lastError: notification.errorMessage || "",
  signupAt: null,
  latestActivityAt: notification.createdAt,
  actions: {
    canResend: notification.status !== "cancelled",
    canCancel: notification.status !== "cancelled",
  },
  stages: {
    1: { status: "na", sentAt: null, errorMessage: "" },
    2: { status: "na", sentAt: null, errorMessage: "" },
    3: { status: "na", sentAt: null, errorMessage: "" },
  },
});

const buildNotificationSummaries = (
  notifications = [],
  userSignupMap = new Map(),
  { type = "", status = "" } = {}
) => {
  const summaries = new Map();

  for (const notification of notifications) {
    const key =
      notification.type === "reminder"
        ? `reminder:${notification.userId}`
        : `download-link:${notification.resumeId || notification._id}`;

    if (!summaries.has(key)) {
      summaries.set(
        key,
        notification.type === "reminder"
          ? buildReminderSummary(notification)
          : buildDownloadLinkSummary(notification)
      );
    }

    const summary = summaries.get(key);

    if (new Date(notification.createdAt) > new Date(summary.latestActivityAt)) {
      summary.latestActivityAt = notification.createdAt;
      summary.latestNotificationId = String(notification._id);
      summary.currentStatus = notification.status;
      summary.actions = {
        canResend: notification.status !== "cancelled",
        canCancel: notification.status !== "cancelled",
      };
    }

    if (notification.errorMessage && !summary.lastError) {
      summary.lastError = notification.errorMessage;
    }

    if (notification.type === "reminder" && notification.reminderStage) {
      const currentStage = summary.stages[notification.reminderStage];

      if (
        currentStage &&
        (!currentStage.sentAt || new Date(notification.createdAt) > new Date(currentStage.sentAt))
      ) {
        summary.stages[notification.reminderStage] = {
          status: notification.status,
          sentAt: notification.createdAt,
          errorMessage: notification.errorMessage || "",
        };
      }
    }
  }

  let rows = Array.from(summaries.values()).map((summary) => {
    summary.signupAt = userSignupMap.get(summary.userId) || null;

    if (summary.type === "reminder") {
      STAGE_NUMBERS.forEach((stageNumber) => {
        if (!summary.stages[stageNumber]) {
          summary.stages[stageNumber] = buildStageSnapshot();
        }
      });
    }

    return summary;
  });

  if (type) {
    rows = rows.filter((row) => row.type === type);
  }

  if (status) {
    rows = rows.filter((row) => row.currentStatus === status);
  }

  rows.sort((a, b) => new Date(b.latestActivityAt) - new Date(a.latestActivityAt));

  return rows;
};

/**
 * GET /api/admin/notifications
 * Paginated, filterable list of all notifications.
 * Query params: page, limit, type (reminder|download-link), status (sent|failed|cancelled), search (email)
 */
export const getNotifications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const { type, status, search } = req.query;
    const reminderControls = await getReminderControlRows({ search });

    const filter = {};
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [
      ...new Set(
        notifications
          .map((notification) => notification.userId)
          .filter((userId) => userId)
          .map((userId) => String(userId))
      ),
    ];
    const users = userIds.length
      ? await User.find({ _id: { $in: userIds } }).select("_id createdAt").lean()
      : [];
    const userSignupMap = new Map(
      users.map((user) => [String(user._id), user.createdAt])
    );

    const notificationSummaries = buildNotificationSummaries(notifications, userSignupMap, {
      type,
      status: status === "pending" ? "pending" : status || "",
    });
    const total = notificationSummaries.length;
    const paginatedSummaries = notificationSummaries.slice(
      (page - 1) * limit,
      page * limit
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reminderControls,
          notifications: paginatedSummaries,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        "Notifications fetched"
      )
    );
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch notifications", [error.message]));
  }
};

/**
 * POST /api/admin/notifications/reminders/:userId/send
 * Send or resend a reminder email for a candidate user in the cron window.
 */
export const sendReminderNotification = async (req, res) => {
  try {
    const reminderControl = await getReminderControlRowByUserId(req.params.userId);

    if (!reminderControl) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Reminder candidate not found or no longer eligible"
          )
        );
    }

    if (reminderControl.currentStatus === "cancelled") {
      return res
        .status(400)
        .json(new ApiError(400, "Reminder is cancelled for this user"));
    }

    let status = "sent";
    let errorMessage = "";
    const latestReminderNotification = await Notification.findOne({
      userId: reminderControl.userId,
      type: "reminder",
    })
      .sort({ createdAt: -1 })
      .select("reminderStage")
      .lean();
    const reminderStage = latestReminderNotification?.reminderStage || 1;

    try {
      await sendReminderEmail(
        reminderControl.userName,
        reminderControl.userEmail
      );
    } catch (emailErr) {
      status = "failed";
      errorMessage = emailErr.message;
    }

    const notification = await Notification.create({
      userId: reminderControl.userId,
      userEmail: reminderControl.userEmail,
      userName: reminderControl.userName,
      type: "reminder",
      reminderStage,
      status,
      errorMessage,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        notification,
        status === "sent"
          ? "Reminder email sent successfully"
          : "Reminder send failed"
      )
    );
  } catch (error) {
    console.error("sendReminderNotification error:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Failed to send reminder notification", [error.message])
      );
  }
};

/**
 * PATCH /api/admin/notifications/reminders/:userId/cancel
 * Cancel reminder sending for a candidate user in the cron window.
 */
export const cancelReminderNotification = async (req, res) => {
  try {
    const reminderControl = await getReminderControlRowByUserId(req.params.userId);

    if (!reminderControl) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Reminder candidate not found or no longer eligible"
          )
        );
    }

    if (reminderControl.currentStatus === "cancelled") {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            reminderControl,
            "Reminder already cancelled for this user"
          )
        );
    }

    const user = await User.findById(reminderControl.userId).select(
      "_id fullName email"
    );

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const notification = await Notification.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      type: "reminder",
      status: "cancelled",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, notification, "Reminder cancelled"));
  } catch (error) {
    console.error("cancelReminderNotification error:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Failed to cancel reminder notification", [error.message])
      );
  }
};

/**
 * POST /api/admin/notifications/:id/resend
 * Resend a failed notification.
 */
export const resendNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json(new ApiError(404, "Notification not found"));
    }
    if (notification.status === "cancelled") {
      return res.status(400).json(new ApiError(400, "Cannot resend a cancelled notification"));
    }

    let newStatus = "sent";
    let errorMessage = "";

    try {
      if (notification.type === "reminder") {
        await sendReminderEmail(notification.userName, notification.userEmail);
      } else if (notification.type === "download-link") {
        const resume = await Resume.findById(notification.resumeId).select("googleDriveLink title");
        if (!resume?.googleDriveLink) {
          return res.status(400).json(new ApiError(400, "Drive link not available for this resume"));
        }
        await sendDriveLinkEmail(notification.userName, notification.userEmail, resume.title || notification.resumeTitle, resume.googleDriveLink);
      }
    } catch (emailErr) {
      newStatus = "failed";
      errorMessage = emailErr.message;
    }

    // Create a new notification log entry for the resend attempt
    const resent = await Notification.create({
      userId: notification.userId,
      userEmail: notification.userEmail,
      userName: notification.userName,
      type: notification.type,
      reminderStage: notification.reminderStage ?? null,
      resumeId: notification.resumeId,
      resumeTitle: notification.resumeTitle,
      status: newStatus,
      errorMessage,
    });

    return res.status(200).json(new ApiResponse(200, resent, newStatus === "sent" ? "Notification resent successfully" : "Resend failed"));
  } catch (error) {
    console.error("resendNotification error:", error);
    return res.status(500).json(new ApiError(500, "Failed to resend notification", [error.message]));
  }
};

/**
 * PATCH /api/admin/notifications/:id/cancel
 * Mark a notification as cancelled.
 */
export const cancelNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json(new ApiError(404, "Notification not found"));
    }
    return res.status(200).json(new ApiResponse(200, notification, "Notification cancelled"));
  } catch (error) {
    console.error("cancelNotification error:", error);
    return res.status(500).json(new ApiError(500, "Failed to cancel notification", [error.message]));
  }
};
