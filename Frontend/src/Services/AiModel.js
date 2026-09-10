// AI client.
//
// This used to call Mistral/OpenAI directly from the browser using
// VITE_-prefixed API keys — which Vite inlines into the public bundle, making
// the keys readable by anyone who loaded the site. All generation now goes
// through the backend (POST /api/ai/generate), which holds the Cloudflare
// Workers AI credential server-side and applies rate limiting.
//
// The exported shape is unchanged: callers still do
//   const result = await AIChatSession.sendMessage(prompt);
//   const text = result.response.text();

import { getApiUrl } from "../config/config";

const REQUEST_TIMEOUT_MS = 90000;

const JSON_PROMPT_PATTERN = /\bjson\b/i;
const PLAIN_TEXT_OVERRIDE_PATTERN =
  /do not wrap.*json|not a json object|only the enhanced summary text|response must be only|must be only the enhanced summary text/i;

// Kept in sync with the same heuristic on the backend. Sent explicitly so the
// two never drift apart.
const shouldRequestJson = (prompt) =>
  JSON_PROMPT_PATTERN.test(prompt) && !PLAIN_TEXT_OVERRIDE_PATTERN.test(prompt);

const stripCodeFences = (value) =>
  String(value || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    return data?.message || "";
  } catch {
    return "";
  }
};

const toUserFacingErrorMessage = (status, serverMessage) => {
  if (serverMessage) {
    return serverMessage;
  }

  if (status === 429) {
    return "You have made too many AI requests. Please try again in a little while.";
  }

  if (status === 503) {
    return "The AI service is busy right now. Please try again in a moment.";
  }

  if (status === 504) {
    return "The AI service took too long. Please try again.";
  }

  if (status === 413) {
    return "There is too much text to analyse. Please shorten it and try again.";
  }

  return "The AI request failed. Please try again.";
};

export const AIChatSession = {
  async sendMessage(prompt) {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("A prompt is required.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;

    try {
      response = await fetch(getApiUrl("ai/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, json: shouldRequestJson(prompt) }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("The AI request took too long. Please try again.");
      }
      throw new Error("Could not reach the AI service. Check your connection.");
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const serverMessage = await parseErrorMessage(response);
      throw new Error(toUserFacingErrorMessage(response.status, serverMessage));
    }

    const payload = await response.json();
    const text = stripCodeFences(payload?.data?.text);

    if (!text) {
      throw new Error("The AI service returned an empty response.");
    }

    // Callers JSON.parse this directly, so fail here with a clear message
    // rather than surfacing a raw SyntaxError from the call site.
    if (shouldRequestJson(prompt)) {
      try {
        JSON.parse(text);
      } catch {
        throw new Error(
          "The AI returned an unexpected format. Please try again."
        );
      }
    }

    return {
      provider: "cloudflare",
      response: {
        text: () => text,
      },
    };
  },
};
