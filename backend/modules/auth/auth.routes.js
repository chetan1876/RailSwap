const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const authMiddleware = require(
  "../../middleware/auth.middleware"
);

/*
=============================
PUBLIC ROUTES
=============================
*/

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

/*
=============================
PROTECTED ROUTES
=============================
*/

router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;