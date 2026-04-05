const DEFAULT_SESSION_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const parseSessionDays = () => {
  const rawValue = process.env.AUTH_SESSION_DAYS;
  const parsedValue = Number.parseInt(rawValue || "", 10);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return DEFAULT_SESSION_DAYS;
};

export const getAuthSessionDays = () => parseSessionDays();

export const getAuthCookieMaxAge = () => getAuthSessionDays() * DAY_IN_MS;

export const getCookieOptions = () => {
  const maxAge = getAuthCookieMaxAge();

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "Dev",
    sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
    path: "/",
    maxAge,
    expires: new Date(Date.now() + maxAge),
  };
};

export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV !== "Dev",
  sameSite: process.env.NODE_ENV !== "Dev" ? "none" : "lax",
  path: "/",
});

export const getUserTokenExpiry = () =>
  process.env.USER_JWT_EXPIRES_IN || `${getAuthSessionDays()}d`;

export const getAdminTokenExpiry = () =>
  process.env.ADMIN_JWT_EXPIRES_IN || `${getAuthSessionDays()}d`;
