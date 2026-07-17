const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const authMiddleware = require(
  "../../middleware/auth.middleware"
);

/*
=================================
PUBLIC ROUTES
=================================
*/

// Register User
router.post(
  "/register",
  authController.register
);

// Login User
router.post(
  "/login",
  authController.login
);

/*
=================================
PROTECTED ROUTES
=================================
*/

// Get Logged In User Profile
router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;