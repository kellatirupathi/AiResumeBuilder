// Shared PDFSpark client.
//
// PDFSpark (the external HTML -> PDF service) returns HTTP 503
// "Server busy. Too many concurrent PDF requests" when it receives too many
// requests at once. To stay under that limit this module:
//   1. Caps how many requests we send to PDFSpark concurrently (a small queue).
//   2. Retries transient failures (503/429/5xx/network/timeout) with
//      exponential backoff + jitter, honoring a Retry-After header when present.
//
// Both the resume and cover-letter PDF services go through requestPdfFromHtml,
// so the concurrency cap is shared process-wide.

const PDFSPARK_API_URL =
  process.env.PDFSPARK_API_URL || "https://pdfspark.dev/api/v1/pdf/from-html";
const PDFSPARK_TIMEOUT_MS = Number(process.env.PDFSPARK_TIMEOUT_MS || 60000);
const PDFSPARK_MAX_RETRIES = Math.max(
  1,
  Number(process.env.PDFSPARK_MAX_RETRIES || 4)
);
const PDFSPARK_RETRY_DELAY_MS = Math.max(
  0,
  Number(process.env.PDFSPARK_RETRY_DELAY_MS || 1500)
);
const PDFSPARK_MAX_BACKOFF_MS = Math.max(
  PDFSPARK_RETRY_DELAY_MS,
  Number(process.env.PDFSPARK_MAX_BACKOFF_MS || 15000)
);
const PDFSPARK_MAX_CONCURRENCY = Math.max(
  1,
  Number(process.env.PDFSPARK_MAX_CONCURRENCY || 2)
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Simple concurrency limiter (semaphore) ------------------------------
let activeRequests = 0;
const waiters = [];

const acquireSlot = () =>
  new Promise((resolve) => {
    if (activeRequests < PDFSPARK_MAX_CONCURRENCY) {
      activeRequests += 1;
      resolve();
    } else {
      waiters.push(resolve);
    }
  });

const releaseSlot = () => {
  const next = waiters.shift();
  if (next) {
    // Hand the slot directly to the next waiter; activeRequests stays the same.
    next();
  } else {
    activeRequests = Math.max(0, activeRequests - 1);
  }
};

// --- Helpers -------------------------------------------------------------
const createPdfsparkHttpError = async (response) => {
  const errorBody = await response.text().catch(() => "");
  const error = new Error(
    `PDFSpark request failed with status ${response.status}${
      errorBody ? `: ${errorBody}` : ""
    }`
  );
  error.status = response.status;
  return error;
};

const shouldRetryPdfsparkError = (error) => {
  if (!error) return false;
  if (error.name === "AbortError") return true; // timeout
  if (typeof error.status === "number") {
    return error.status === 429 || error.status >= 500;
  }
  return error instanceof TypeError; // network / fetch failure
};

// Parse a Retry-After header (seconds or HTTP-date) into milliseconds.
const parseRetryAfterMs = (headerValue) => {
  if (!headerValue) return null;
  const asSeconds = Number(headerValue);
  if (Number.isFinite(asSeconds)) {
    return Math.max(0, asSeconds * 1000);
  }
  const asDate = Date.parse(headerValue);
  if (!Number.isNaN(asDate)) {
    return Math.max(0, asDate - Date.now());
  }
  return null;
};

// Exponential backoff with full jitter, capped.
const computeBackoffMs = (attempt) => {
  const exponential = PDFSPARK_RETRY_DELAY_MS * 2 ** (attempt - 1);
  const capped = Math.min(exponential, PDFSPARK_MAX_BACKOFF_MS);
  const jitter = Math.random() * (capped * 0.25);
  return Math.round(capped + jitter);
};

/**
 * Send HTML to PDFSpark and return the PDF as a Buffer.
 * Throttled by a shared concurrency limiter and retried on transient errors.
 *
 * @param {string} html  Fully rendered HTML document.
 * @param {{ label?: string }} [opts]  Human-readable label for logs (e.g. "resume <id>").
 * @returns {Promise<Buffer>}
 */
export const requestPdfFromHtml = async (html, { label = "document" } = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= PDFSPARK_MAX_RETRIES; attempt += 1) {
    let caughtError;
    let retryAfterMs = null;

    await acquireSlot();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PDFSPARK_TIMEOUT_MS);
    const requestStartedAt = Date.now();

    try {
      const response = await fetch(PDFSPARK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          options: { format: "A4", printBackground: true },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
        throw await createPdfsparkHttpError(response);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      caughtError = error;
      const durationMs = Date.now() - requestStartedAt;
      const isTimeout = error?.name === "AbortError";
      const failureReason = isTimeout
        ? `PDFSpark request timed out after ${PDFSPARK_TIMEOUT_MS}ms`
        : error.message;

      lastError = new Error(
        `Failed to generate PDF for ${label} on attempt ${attempt}/${PDFSPARK_MAX_RETRIES}: ${failureReason}`,
        { cause: error }
      );
      // Preserve a usable HTTP status so callers can map it (503 busy -> 503).
      lastError.status =
        typeof error?.status === "number"
          ? error.status
          : isTimeout
          ? 504
          : 502;
      lastError.durationMs = durationMs;
    } finally {
      clearTimeout(timeout);
      releaseSlot();
    }

    // Reached only on failure (success returns inside the try block).
    if (attempt < PDFSPARK_MAX_RETRIES && shouldRetryPdfsparkError(caughtError)) {
      const backoffMs = retryAfterMs ?? computeBackoffMs(attempt);
      console.warn(
        `Retrying PDF generation for ${label} after attempt ${attempt} failed in ${lastError.durationMs}ms: ${caughtError.message}. Waiting ${backoffMs}ms (active=${activeRequests}, queued=${waiters.length}).`
      );
      await wait(backoffMs);
      continue;
    }

    console.error(`Error generating PDF for ${label}:`, lastError);
    throw lastError;
  }

  throw lastError || new Error("Failed to generate PDF");
};

export const PDFSPARK_MAX_HTML_BYTES = 5 * 1024 * 1024;
