const AUTH_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MISTRAL_MODEL = import.meta.env.VITE_MISTRAL_MODEL || "mistral-medium-latest";
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-4.1-mini";
const MISTRAL_ENDPOINT = import.meta.env.VITE_MISTRAL_ENDPOINT || "https://api.mistral.ai/v1/chat/completions";
const OPENAI_ENDPOINT = import.meta.env.VITE_OPENAI_ENDPOINT || "https://api.openai.com/v1/chat/completions";
const VITE_APP_URL = import.meta.env.VITE_APP_URL;
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export {
  AUTH_KEY,
  API_KEY,
  MISTRAL_API_KEY,
  OPENAI_API_KEY,
  MISTRAL_MODEL,
  OPENAI_MODEL,
  MISTRAL_ENDPOINT,
  OPENAI_ENDPOINT,
  VITE_PUBLIC_URL,
  VITE_APP_URL,
  VITE_GOOGLE_CLIENT_ID,
};
