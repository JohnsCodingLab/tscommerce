export const DB_NAME = "SDIkDphwx6CB9xir";

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
} as const;

export const REFRESH_TOKEN_TTL_DAYS = 7;
export const ACCESS_TOKEN_TTL_MINUTES = 15;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
};

export const CACHE_TTL = {
  USER: 300, // 5 minutes
  PRODUCT: 600, // 10 minutes
};
