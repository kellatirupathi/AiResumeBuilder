import {
  MISTRAL_API_KEY,
  MISTRAL_ENDPOINT,
  MISTRAL_MODEL,
  OPENAI_API_KEY,
  OPENAI_ENDPOINT,
  OPENAI_MODEL,
} from "../config/config";

const REQUEST_TIMEOUT_MS = 30000;
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

const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
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

const callProvider = async (provider, prompt, wantsJson) => {
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
    REQUEST_TIMEOUT_MS
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

    for (const provider of providers) {
      try {
        const text = await callProvider(provider, prompt, wantsJson);

        return {
          provider: provider.name,
          response: {
            text: () => text,
          },
        };
      } catch (error) {
        console.warn(`[AI] ${provider.name} failed, trying fallback if available.`, error);
        errors.push(`${provider.name}: ${error.message}`);
      }
    }

    throw new Error(`All AI providers failed. ${errors.join(" | ")}`);
  },
};
