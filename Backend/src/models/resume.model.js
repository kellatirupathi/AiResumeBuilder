// C:\Users\NxtWave\Downloads\code\Backend\src\models\resume.model.js
import mongoose from "mongoose";
import educationSchema from "./education.model.js";

// Sub-schema for storing a version snapshot
const versionSchema = new mongoose.Schema({
  savedAt: { type: Date, default: Date.now },
  resumeData: { type: mongoose.Schema.Types.Mixed, required: true } 
}, { timestamps: false });


// Define the certification schema
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String },
  credentialLink: { type: String }
}, { _id: false });

// Define the new additional section schema
const additionalSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  // Social profile links
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  // Template information
  template: { 
    type: String, 
    default: "modern", 
    enum: [
      "modern", 
      "professional", 
      "creative", 
      "minimalist", 
      "executive", 
      "creative-modern", 
      "tech-startup", 
      "elegant-portfolio",
      "modern-timeline",
      "modern-grid",
      "modern-sidebar",
      "gradient-accent",
      "bold-impact",
      "split-frame",
      "minimalist-pro",
      "digital-card"
    ] 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experience: [
    {
      title: { type: String },
      companyName: { type: String },
      city: { type: String },
      state: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      currentlyWorking: { type: Boolean, default: false },
      workSummary: { type: String },
    },
  ],
  education: [educationSchema],
  skills: [
    {
      name: { type: String },
      rating: { type: Number },
    },
  ],
  projects: [
    {
      projectName: { type: String },
      techStack: { type: String },
      projectSummary: { type: String },
      githubLink: { type: String },
      deployedLink: { type: String },
    },
  ],
  certifications: [certificationSchema],
  additionalSections: [additionalSectionSchema],
  versions: [versionSchema],
  viewCount: { type: Number, default: 0 },
  themeColor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // --- NEW FIELDS ---
  googleDriveFileId: { type: String, default: null },
  googleDriveLink: { type: String, default: null },
  // --- END OF NEW FIELDS ---
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
