const express = require("express");

const router = express.Router();

/* Controllers */
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
} = require("./auth.controller");

/* Validations */
const {
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("./auth.validation");

/* Middleware */
const authMiddleware = require(
  "../../middleware/auth.middleware"
);

/* ==========================
   AUTH ROUTES
========================== */

/* Register User */
router.post(
  "/register",
  registerValidation,
  register
);

/* Verify OTP */
router.post(
  "/verify-otp",
  verifyOtpValidation,
  verifyOtp
);

/* Login User */
router.post(
  "/login",
  loginValidation,
  login
);

/* Forgot Password */
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  forgotPassword
);

/* Reset Password */
router.post(
  "/reset-password",
  resetPasswordValidation,
  resetPassword
);

/* Logout User */
router.post(
  "/logout",
  authMiddleware,
  logout
);

module.exports = router;