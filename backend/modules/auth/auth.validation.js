const { body } = require("express-validator");

/* ===========================
   REGISTER VALIDATION
=========================== */

const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Full name must be between 3 and 100 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please enter a valid Indian mobile number"
    ),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long"
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain at least one special character"
    ),

  body("gender")
    .optional()
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("Invalid gender value"),
];

/* ===========================
   LOGIN VALIDATION
=========================== */

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

/* ===========================
   OTP VALIDATION
=========================== */

const verifyOtpValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

/* ===========================
   FORGOT PASSWORD
=========================== */

const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];

/* ===========================
   RESET PASSWORD
=========================== */

const resetPasswordValidation = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long"
    )
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "Password must contain at least one special character"
    ),
];

module.exports = {
  registerValidation,
  loginValidation,
  verifyOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};