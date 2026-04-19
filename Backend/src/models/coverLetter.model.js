import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    savedAt: { type: Date, default: Date.now },
    coverLetterData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: false }
);

const generatedContentSchema = new mongoose.Schema(
  {
    greeting: { type: String, default: "" },
    openingParagraph: { type: String, default: "" },
    bodyParagraphs: { type: [String], default: [] },
    closingParagraph: { type: String, default: "" },
    signature: { type: String, default: "" },
  },
  { _id: false }
);

const coverLetterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },

  template: {
    type: String,
    default: "executive-classic",
    enum: [
      "executive-classic",
      "modern-minimal",
      "creative-bold",
      "corporate-formal",
      "tech-sidebar",
      "elegant-serif",
      "split-header",
      "vertical-accent",
      "modern-card",
      "newsletter",
    ],
  },
  themeColor: { type: String, default: "#1c2434" },

  // Source resume — either an existing resume or an uploaded PDF
  sourceResumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    default: null,
  },
  uploadedResumeFileId: { type: String, default: null },
  uploadedResumeFileName: { type: String, default: null },
  uploadedResumeText: { type: String, default: "" },

  // Sender details (cached from resume / user for the letter header)
  senderName: { type: String, default: "" },
  senderEmail: { type: String, default: "" },
  senderPhone: { type: String, default: "" },
  senderAddress: { type: String, default: "" },
  senderLinkedin: { type: String, default: "" },
  senderPortfolio: { type: String, default: "" },

  // JD + recipient
  jobTitle: { type: String, default: "" },
  companyName: { type: String, default: "" },
  hiringManagerName: { type: String, default: "" },
  jobDescription: { type: String, default: "" },

  tone: {
    type: String,
    default: "formal",
    enum: ["formal", "friendly", "enthusiastic"],
  },

  generatedContent: { type: generatedContentSchema, default: () => ({}) },

  versions: [versionSchema],
  viewCount: { type: Number, default: 0 },

  // Drive + public sharing
  googleDriveFileId: { type: String, default: null },
  googleDriveLink: { type: String, default: null },
  driveOutOfSync: { type: Boolean, default: false },
  publicSlug: { type: String, default: null, index: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema);

export default CoverLetter;
