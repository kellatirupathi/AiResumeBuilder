import {
  AI_MAX_PROMPT_CHARS,
  generateText,
  isAiConfigured,
} from "../services/ai.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// In-memory sliding-window rate limiter.
//
// The AI endpoint is reachable without a session (the public ATS checker), so
// without a cap any visitor can burn the Workers AI daily allocation. Signed-in
// users are limited per user id, anonymous callers per IP, with a tighter cap.
//
// This is per-process state: it resets on restart and is not shared across
// replicas. That is acceptable as a first line of defence — move to Redis or a
// Cloudflare-side rule if the backend is ever scaled horizontally.
const WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000);
const AUTHED_LIMIT = Number(process.env.AI_RATE_LIMIT_AUTHED || 60);
const ANON_LIMIT = Number(process.env.AI_RATE_LIMIT_ANON || 10);

const requestLog = new Map(); // key -> number[] (timestamps)

// Drop stale keys so the map cannot grow without bound.
const pruneRequestLog = (now) => {
  for (const [key, timestamps] of requestLog) {
    const fresh = timestamps.filter((time) => now - time < WINDOW_MS);
    if (fresh.length) {
      requestLog.set(key, fresh);
    } else {
      requestLog.delete(key);
    }
  }
};

let lastPrunedAt = Date.now();

const checkRateLimit = (key, limit) => {
  const now = Date.now();

  if (now - lastPrunedAt > WINDOW_MS) {
    pruneRequestLog(now);
    lastPrunedAt = now;
  }

  const timestamps = (requestLog.get(key) || []).filter(
    (time) => now - time < WINDOW_MS
  );

  if (timestamps.length >= limit) {
    const retryAfterMs = WINDOW_MS - (now - timestamps[0]);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return { allowed: true };
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
};

/**
 * POST /api/ai/generate
 *
 * Body: { prompt: string, json?: boolean }
 * Returns: { text: string }
 *
 * Open to anonymous callers (the public ATS checker needs it) but rate limited.
 */
export const generateAiContent = async (req, res) => {
  try {
    if (!isAiConfigured()) {
      return res
        .status(503)
        .json(new ApiError(503, "AI is not configured on the server."));
    }

    const { prompt, json } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json(new ApiError(400, "A prompt is required."));
    }

    if (prompt.length > AI_MAX_PROMPT_CHARS) {
      return res
        .status(413)
        .json(
          new ApiError(
            413,
            `Prompt is too long. Please shorten it to under ${AI_MAX_PROMPT_CHARS} characters.`
          )
        );
    }

    // req.user is set only when the optional auth middleware found a valid token.
    const isAuthed = Boolean(req.user?._id);
    const rateKey = isAuthed
      ? `user:${req.user._id.toString()}`
      : `ip:${getClientIp(req)}`;
    const limit = isAuthed ? AUTHED_LIMIT : ANON_LIMIT;

    const { allowed, retryAfterSeconds } = checkRateLimit(rateKey, limit);

    if (!allowed) {
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            isAuthed
              ? "You have made too many AI requests. Please try again later."
              : "Too many AI requests from this network. Please sign in or try again later."
          )
        );
    }

    const text = await generateText(prompt, {
      json: typeof json === "boolean" ? json : undefined,
      label: isAuthed ? `user ${req.user._id}` : "anonymous",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { text }, "AI content generated."));
  } catch (error) {
    console.error("AI generation failed:", error.message);

    const status = error?.status || error?.cause?.status;

    if (status === 429) {
      return res
        .status(503)
        .json(
          new ApiError(
            503,
            "The AI service is busy right now. Please try again in a few moments."
          )
        );
    }

    if (status === 504) {
      return res
        .status(504)
        .json(new ApiError(504, "The AI service took too long. Please try again."));
    }

    if (status === 401 || status === 403) {
      // Never surface the upstream credential error to the client.
      return res
        .status(503)
        .json(new ApiError(503, "The AI service is unavailable right now."));
    }

    return res
      .status(502)
      .json(
        new ApiError(502, "The AI service failed to respond. Please try again.")
      );
  }
};
