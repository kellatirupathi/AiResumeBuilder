import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import coverLetterRouter from "./routes/coverLetter.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import adminRouter from "./routes/admin.routes.js";
import niatIdRouter from "./routes/niatId.routes.js";
import cronRouter from "./routes/cron.routes.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_SITE,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

console.log("CORS configured with origin:", process.env.ALLOWED_SITE);
app.use(cors(corsOptions));

// Add OPTIONS preflight response
app.options("*", cors(corsOptions));

// Request logging without leaking cookie contents into application logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  const cookieKeys = Object.keys(req.cookies || {});
  console.log("Cookie keys:", cookieKeys.length ? cookieKeys.join(", ") : "none");
  next();
});

// API routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/cover-letters", coverLetterRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/admin", adminRouter);
app.use("/api/niat-ids", niatIdRouter);
app.use("/api/cron", cronRouter);

// Simple status endpoint
app.get("/api/status", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    allowedOrigin: process.env.ALLOWED_SITE
  });
});

export default app;
