import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
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

// Debug middleware to log cookies
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Cookies:", req.cookies);
  next();
});

// API routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/pdf", pdfRouter);

// Simple status endpoint
app.get("/api/status", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    environment: process.env.NODE_ENV,
    allowedOrigin: process.env.ALLOWED_SITE
  });
});

export default app;
