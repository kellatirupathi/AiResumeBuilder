// Cloudflare Workers AI client.
//
// All AI generation for the app runs through here. The frontend used to call
// Mistral/OpenAI directly with VITE_-prefixed keys, which shipped those keys in
// the browser bundle; everything now goes through the backend so the credential
// stays server-side.
//
// Cloudflare exposes an OpenAI-compatible chat-completions endpoint, so the
// request/response shape matches what the frontend already expected.

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// llama-3.3-70b-fp8-fast gives the best instruction-following of the JSON-mode
// capable models. Drop to @cf/meta/llama-3.1-8b-instruct-fp8-fast (~6x cheaper
// in neurons) via env if the daily allocation becomes a constraint.
const CLOUDFLARE_AI_MODEL =
  process.env.CLOUDFLARE_AI_MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 60000);
const AI_MAX_RETRIES = Math.max(1, Number(process.env.AI_MAX_RETRIES || 3));
const AI_RETRY_DELAY_MS = Math.max(0, Number(process.env.AI_RETRY_DELAY_MS || 1000));
const AI_MAX_BACKOFF_MS = Math.max(
  AI_RETRY_DELAY_MS,
  Number(process.env.AI_MAX_BACKOFF_MS || 8000)
);
// Workers AI models cap well below the 8192 the old client requested; 4096 is
// comfortably above the largest response any prompt in the app needs.
const AI_MAX_TOKENS = Number(process.env.AI_MAX_TOKENS || 4096);

// Guard against a pathological prompt (e.g. a pasted book as a job description)
// running up the neuron bill or blowing the model's context window.
export const AI_MAX_PROMPT_CHARS = Number(
  process.env.AI_MAX_PROMPT_CHARS || 24000
);

const buildEndpoint = () =>
  `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/v1/chat/completions`;

export const isAiConfigured = () =>
  Boolean(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mirrors the heuristic the frontend used: ask for JSON mode when the prompt
// asks for JSON, unless it explicitly demands plain prose.
const JSON_PROMPT_PATTERN = /\bjson\b/i;
const PLAIN_TEXT_OVERRIDE_PATTERN =
  /do not wrap.*json|not a json object|only the enhanced summary text|response must be only|must be only the enhanced summary text/i;

export const shouldRequestJson = (prompt) =>
  JSON_PROMPT_PATTERN.test(prompt) && !PLAIN_TEXT_OVERRIDE_PATTERN.test(prompt);

const shouldRetry = (error) => {
  if (!error) return false;
  if (error.name === "AbortError") return true; // timeout
  if (typeof error.status === "number") {
    return error.status === 429 || error.status >= 500;
  }
  return error instanceof TypeError; // network / fetch failure
};

const parseRetryAfterMs = (headerValue) => {
  if (!headerValue) return null;
  const asSeconds = Number(headerValue);
  if (Number.isFinite(asSeconds)) {
    // Clamp: never let an upstream header pin an Express request open for long.
    return Math.min(Math.max(0, asSeconds * 1000), AI_MAX_BACKOFF_MS);
  }
  const asDate = Date.parse(headerValue);
  if (!Number.isNaN(asDate)) {
    return Math.min(Math.max(0, asDate - Date.now()), AI_MAX_BACKOFF_MS);
  }
  return null;
};

const computeBackoffMs = (attempt) => {
  const exponential = AI_RETRY_DELAY_MS * 2 ** (attempt - 1);
  const capped = Math.min(exponential, AI_MAX_BACKOFF_MS);
  const jitter = Math.random() * (capped * 0.25);
  return Math.round(capped + jitter);
};

const createHttpError = async (response) => {
  const errorBody = await response.text().catch(() => "");
  const error = new Error(
    `Cloudflare Workers AI request failed with status ${response.status}${
      errorBody ? `: ${errorBody.slice(0, 500)}` : ""
    }`
  );
  error.status = response.status;
  return error;
};

const stripCodeFences = (value) =>
  String(value || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const extractText = (data) => {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  // Some models return content as an array of parts.
  if (Array.isArray(content)) {
    const merged = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("")
      .trim();

    if (merged) return merged;
  }

  throw new Error("Cloudflare Workers AI returned no message content.");
};

/**
 * Send a prompt to Cloudflare Workers AI and return the completion text.
 *
 * Retries transient failures (429/5xx/network/timeout) with exponential
 * backoff, honoring Retry-After when present.
 *
 * @param {string} prompt
 * @param {{ json?: boolean, label?: string }} [opts]
 * @returns {Promise<string>}
 */
export const generateText = async (prompt, { json, label = "ai" } = {}) => {
  if (!isAiConfigured()) {
    const error = new Error(
      "Cloudflare Workers AI is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN."
    );
    error.status = 503;
    throw error;
  }

  const wantsJson = typeof json === "boolean" ? json : shouldRequestJson(prompt);

  const body = {
    model: CLOUDFLARE_AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: AI_MAX_TOKENS,
  };

  if (wantsJson) {
    body.response_format = { type: "json_object" };
  }

  let lastError = null;

  for (let attempt = 1; attempt <= AI_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
      const response = await fetch(buildEndpoint(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const httpError = await createHttpError(response);

        if (shouldRetry(httpError) && attempt < AI_MAX_RETRIES) {
          const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
          const delay = retryAfterMs ?? computeBackoffMs(attempt);
          console.warn(
            `[AI] ${label} attempt ${attempt}/${AI_MAX_RETRIES} failed (${httpError.status}); retrying in ${delay}ms.`
          );
          clearTimeout(timeoutId);
          await wait(delay);
          lastError = httpError;
          continue;
        }

        throw httpError;
      }

      const data = await response.json();
      const text = stripCodeFences(extractText(data));

      if (!text) {
        throw new Error("Cloudflare Workers AI returned an empty response.");
      }

      // Cloudflare does not guarantee schema adherence even in JSON mode, so
      // validate here and let the retry loop take another pass at it.
      if (wantsJson) {
        try {
          JSON.parse(text);
        } catch {
          const parseError = new Error(
            "Cloudflare Workers AI returned malformed JSON."
          );
          parseError.status = 502;

          if (attempt < AI_MAX_RETRIES) {
            console.warn(
              `[AI] ${label} attempt ${attempt}/${AI_MAX_RETRIES} returned invalid JSON; retrying.`
            );
            clearTimeout(timeoutId);
            await wait(computeBackoffMs(attempt));
            lastError = parseError;
            continue;
          }

          throw parseError;
        }
      }

      return text;
    } catch (error) {
      const isTimeout = error?.name === "AbortError";

      if (shouldRetry(error) && attempt < AI_MAX_RETRIES) {
        const delay = computeBackoffMs(attempt);
        console.warn(
          `[AI] ${label} attempt ${attempt}/${AI_MAX_RETRIES} failed (${error.message}); retrying in ${delay}ms.`
        );
        lastError = error;
        await wait(delay);
        continue;
      }

      const wrapped = new Error(
        isTimeout
          ? "Cloudflare Workers AI request timed out."
          : error.message || "Cloudflare Workers AI request failed.",
        { cause: error }
      );
      wrapped.status =
        typeof error?.status === "number" ? error.status : isTimeout ? 504 : 502;
      throw wrapped;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  const finalError = new Error(
    lastError?.message || "Cloudflare Workers AI request failed."
  );
  finalError.status = typeof lastError?.status === "number" ? lastError.status : 502;
  throw finalError;
};
