import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: "" },
    type: {
      type: String,
      enum: ["reminder", "download-link"],
      required: true,
    },
    reminderStage: { type: Number, default: null }, // 1, 2, or 3 for reminder emails
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", default: null },
    resumeTitle: { type: String, default: "" },
    status: {
      type: String,
      enum: ["sent", "failed", "cancelled"],
      default: "sent",
    },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
