import {
  MISTRAL_API_KEY,
  MISTRAL_ENDPOINT,
  MISTRAL_MODEL,
  OPENAI_API_KEY,
  OPENAI_ENDPOINT,
  OPENAI_MODEL,
} from "../config/config";

const REQUEST_TIMEOUT_MS = 60000;
const JSON_PROMPT_PATTERN = /\bjson\b/i;
const PLAIN_TEXT_OVERRIDE_PATTERN =
  /do not wrap.*json|not a json object|only the enhanced summary text|response must be only|must be only the enhanced summary text/i;

const stripCodeFences = (value) =>
  value.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();

const shouldRequestJson = (prompt) =>
  JSON_PROMPT_PATTERN.test(prompt) && !PLAIN_TEXT_OVERRIDE_PATTERN.test(prompt);

const normalizeResponseText = (prompt, text) => {
  const cleanText = stripCodeFences(text || "");

  if (!cleanText) {
    throw new Error("Provider returned an empty response.");
  }

  if (shouldRequestJson(prompt)) {
    JSON.parse(cleanText);
  }

  return cleanText;
};

const toUserFacingErrorMessage = (error, providerName) => {
  if (error?.name === "AbortError") {
    return "AI provider took too long. Please try again.";
  }

  const message = String(error?.message || "");

  if (/status 401|unauthorized/i.test(message)) {
    return `${providerName} authentication failed. Please check the API configuration.`;
  }

  if (/status 429|rate limit|capacity exceeded|service tier capacity exceeded/i.test(message)) {
    return `${providerName} is busy right now. Please try again in a moment.`;
  }

  if (/status 500|status 502|status 503|status 504|server error/i.test(message)) {
    return `${providerName} is temporarily unavailable. Please try again.`;
  }

  return `${providerName} request failed. Please try again.`;
};

const buildMessages = (prompt) => [{ role: "user", content: prompt }];

const buildMistralBody = (prompt, wantsJson) => {
  const body = {
    model: MISTRAL_MODEL,
    messages: buildMessages(prompt),
    temperature: 1,
    top_p: 0.95,
    max_tokens: 8192,
  };

  if (wantsJson) {
    body.response_format = { type: "json_object" };
  }

  return body;
};

const buildOpenAIBody = (prompt, wantsJson) => {
  const body = {
    model: OPENAI_MODEL,
    messages: buildMessages(prompt),
    temperature: 1,
    max_tokens: 8192,
  };

  if (wantsJson) {
    body.response_format = { type: "json_object" };
  }

  return body;
};

const extractChatCompletionText = (data, providerName) => {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const mergedContent = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        return "";
      })
      .join("")
      .trim();

    if (mergedContent) {
      return mergedContent;
    }
  }

  throw new Error(`${providerName} returned no message content.`);
};

const fetchWithTimeout = async (url, options, timeoutMs, controller = new AbortController()) => {
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

const providers = [
  {
    name: "Mistral",
    apiKey: MISTRAL_API_KEY,
    endpoint: MISTRAL_ENDPOINT,
    buildBody: buildMistralBody,
  },
  {
    name: "OpenAI",
    apiKey: OPENAI_API_KEY,
    endpoint: OPENAI_ENDPOINT,
    buildBody: buildOpenAIBody,
  },
].filter((provider) => provider.apiKey && provider.endpoint);

const callProvider = async (provider, prompt, wantsJson, controller) => {
  const response = await fetchWithTimeout(
    provider.endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify(provider.buildBody(prompt, wantsJson)),
    },
    REQUEST_TIMEOUT_MS,
    controller
  );

  if (!response.ok) {
    let errorBody = "";

    try {
      errorBody = await response.text();
    } catch {
      errorBody = "";
    }

    throw new Error(
      `${provider.name} request failed with status ${response.status}${errorBody ? `: ${errorBody.slice(0, 300)}` : ""}`
    );
  }

  const data = await response.json();
  const text = extractChatCompletionText(data, provider.name);

  return normalizeResponseText(prompt, text);
};

export const AIChatSession = {
  async sendMessage(prompt) {
    if (!providers.length) {
      throw new Error("No AI provider is configured.");
    }

    const wantsJson = shouldRequestJson(prompt);
    const errors = [];
    const userFacingErrors = [];
    const controllers = providers.map(() => new AbortController());

    const providerPromises = providers.map((provider, index) =>
      callProvider(provider, prompt, wantsJson, controllers[index])
        .then((text) => ({
          provider: provider.name,
          response: {
            text: () => text,
          },
        }))
        .catch((error) => {
          console.warn(`[AI] ${provider.name} failed, trying fallback if available.`, error);
          errors.push(`${provider.name}: ${error.message}`);
          userFacingErrors.push(toUserFacingErrorMessage(error, provider.name));
          throw error;
        })
    );

    try {
      const result = await Promise.any(providerPromises);

      controllers.forEach((controller, index) => {
        if (providers[index].name !== result.provider && !controller.signal.aborted) {
          controller.abort();
        }
      });

      return result;
    } catch {
      controllers.forEach((controller) => {
        if (!controller.signal.aborted) {
          controller.abort();
        }
      });
    }

    const uniqueMessages = [...new Set(userFacingErrors)].filter(Boolean);

    throw new Error(
      uniqueMessages[0] || `All AI providers failed. ${errors.join(" | ")}`
    );
  },
};
