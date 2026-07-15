/*
========================================
JWT CONFIGURATION
========================================
*/

const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",

  ACCESS_TOKEN_COOKIE_NAME:
    "accessToken",

  REFRESH_TOKEN_COOKIE_NAME:
    "refreshToken",
};

/*
========================================
OTP CONFIGURATION
========================================
*/

const OTP_CONFIG = {
  LENGTH: 6,

  EXPIRY_TIME:
    10 * 60 * 1000, // 10 Minutes

  MAX_ATTEMPTS: 5,
};

/*
========================================
PASSWORD RESET CONFIGURATION
========================================
*/

const PASSWORD_RESET_CONFIG = {
  TOKEN_EXPIRY:
    15 * 60 * 1000, // 15 Minutes
};

/*
========================================
LOGIN SECURITY CONFIGURATION
========================================
*/

const LOGIN_SECURITY_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,

  ACCOUNT_LOCK_DURATION:
    30 * 60 * 1000, // 30 Minutes
};

/*
========================================
COOKIE CONFIGURATION
========================================
*/

const COOKIE_CONFIG = {
  HTTP_ONLY: true,

  SECURE:
    process.env.NODE_ENV ===
    "production",

  SAME_SITE: "strict",

  ACCESS_TOKEN_MAX_AGE:
    15 * 60 * 1000,

  REFRESH_TOKEN_MAX_AGE:
    7 *
    24 *
    60 *
    60 *
    1000,
};

/*
========================================
AUTH STATUS MESSAGES
========================================
*/

const AUTH_MESSAGES = {
  REGISTER_SUCCESS:
    "User registered successfully.",

  LOGIN_SUCCESS:
    "Login successful.",

  LOGOUT_SUCCESS:
    "Logout successful.",

  OTP_SENT:
    "OTP sent successfully.",

  OTP_VERIFIED:
    "OTP verified successfully.",

  INVALID_CREDENTIALS:
    "Invalid email or password.",

  ACCOUNT_NOT_VERIFIED:
    "Please verify your account first.",

  ACCOUNT_LOCKED:
    "Account temporarily locked due to multiple failed login attempts.",

  INVALID_OTP:
    "Invalid OTP.",

  OTP_EXPIRED:
    "OTP has expired.",

  PASSWORD_RESET_SENT:
    "Password reset link sent successfully.",

  PASSWORD_RESET_SUCCESS:
    "Password reset successful.",

  USER_NOT_FOUND:
    "User not found.",
};

/*
========================================
AUTH ROUTES PREFIX
========================================
*/

const AUTH_ROUTES = {
  BASE: "/api/auth",

  REGISTER: "/register",

  LOGIN: "/login",

  LOGOUT: "/logout",

  VERIFY_OTP: "/verify-otp",

  SEND_OTP: "/send-otp",

  FORGOT_PASSWORD:
    "/forgot-password",

  RESET_PASSWORD:
    "/reset-password",

  REFRESH_TOKEN:
    "/refresh-token",
};

module.exports = {
  JWT_CONFIG,
  OTP_CONFIG,
  PASSWORD_RESET_CONFIG,
  LOGIN_SECURITY_CONFIG,
  COOKIE_CONFIG,
  AUTH_MESSAGES,
  AUTH_ROUTES,
};