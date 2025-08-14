// C:\Users\NxtWave\Downloads\code\Backend\src\models\user.model.js
// This schema is correct. It uses `fullName` to store the complete name in the database.
// The controller will handle splitting this into firstName/lastName for the frontend.
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import educationSchema from "./education.model.js";

const { Schema, model } = mongoose;

// Sub-schema for storing a version snapshot (from resume model)
const versionSchema = new mongoose.Schema({
  savedAt: { type: Date, default: Date.now },
  resumeData: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: false });

// Certification schema (from resume model)
const certificationSchema = new mongoose.Schema({
  name: { type: String },
  issuer: { type: String },
  date: { type: String },
  credentialLink: { type: String }
}, { _id: false });

// Additional section schema (from resume model)
const additionalSectionSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String, default: "" },
}, { _id: false });


const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  niatId: { // Keep niatId if it's important for your user management
    type: String,
    unique: true,
    sparse: true // Allows multiple null values if not provided, but unique if it is
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // --- START: MASTER PROFILE DATA ---
  jobTitle: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  summary: { type: String, default: "" },

  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  
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
      rating: { type: Number, default: 0 },
    },
  ],
  projects: [
    {
      projectName: { type: String },
      techStack: { type: String },
      projectSummary: { type: String },
      githubLink: { type: String, default: "" },
      deployedLink: { type: String, default: "" },
    },
  ],
  certifications: [certificationSchema],
  additionalSections: [additionalSectionSchema]
  // --- END: MASTER PROFILE DATA ---

}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;
