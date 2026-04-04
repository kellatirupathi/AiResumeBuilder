import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: undefined,
    },
    role: {
      type: String,
      enum: ["owner", "admin"],
      default: "admin",
      required: true,
    },
    inviteToken: {
      type: String,
      default: undefined,
    },
    inviteTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = model("Admin", adminSchema);

export default Admin;
