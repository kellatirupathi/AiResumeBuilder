import mongoose from "mongoose";

const { Schema, model } = mongoose;

const externalInviteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked", "used"],
      default: "active",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    openCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    signupCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    openedAt: {
      type: [Date],
      default: [],
    },
    usedAt: {
      type: [Date],
      default: [],
    },
    lastOpenedAt: {
      type: Date,
      default: null,
    },
    lastSignedUpAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ExternalInvite = model("ExternalInvite", externalInviteSchema);

export default ExternalInvite;
