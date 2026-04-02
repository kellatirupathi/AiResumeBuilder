import Notification from "../models/notification.model.js";
import { sendReminderEmail, sendDriveLinkEmail } from "../services/email.service.js";
import Resume from "../models/resume.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) filter.userEmail = { $regex: search, $options: "i" };

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json(
      new ApiResponse(200, { notifications, total, page, limit, totalPages: Math.ceil(total / limit) }, "Notifications fetched")
    );
  } catch (error) {
    console.error("getNotifications error:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch notifications", [error.message]));
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
