const AUTH_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
// AI provider keys are deliberately NOT read here. Anything prefixed with
// VITE_ is inlined into the public bundle by Vite, so a secret placed here is
// readable by every visitor. AI generation goes through the backend instead —
// see Services/AiModel.js and Backend/src/services/ai.service.js.
const VITE_APP_URL = import.meta.env.VITE_APP_URL;
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = "/api/";

const getApiUrl = (path = "") => {
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${API_BASE_URL}${normalizedPath}`;
};

export {
  AUTH_KEY,
  API_KEY,
  VITE_PUBLIC_URL,
  VITE_APP_URL,
  VITE_GOOGLE_CLIENT_ID,
  API_BASE_URL,
  getApiUrl,
};
