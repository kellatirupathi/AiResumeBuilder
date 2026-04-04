import { queryClient } from "@/lib/queryClient";

const QUERY_CACHE_KEY = "nxtresume-query-cache";
const REDUX_PERSIST_KEY = "persist:root";

export function clearUserSessionState() {
  queryClient.clear();

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(QUERY_CACHE_KEY);
  window.localStorage.removeItem(REDUX_PERSIST_KEY);
}

export function handleUnauthorizedUserSession() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.__nxtresumeUnauthorizedHandling) {
    return;
  }

  window.__nxtresumeUnauthorizedHandling = true;
  clearUserSessionState();

  const nextPath = window.location.pathname === "/" ? "/" : "/";
  window.location.replace(nextPath);
}
