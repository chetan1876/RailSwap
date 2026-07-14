const { validationResult } = require(
  "express-validator"
);

const authService = require(
  "./auth.service"
);

/* =========================
   REGISTER
========================= */

const register = async (
  req,
  res
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors:
          errors.array(),
      });
    }

    const {
      fullName,
      email,
      phoneNumber,
      password,
      gender,
    } = req.body;

    const result =
      await authService.registerUser(
        fullName,
        email,
        phoneNumber,
        password,
        gender
      );

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please verify OTP.",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* =========================
   VERIFY OTP
========================= */

const verifyOtp =
  async (req, res) => {
    try {
      const errors =
        validationResult(req);

      if (
        !errors.isEmpty()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            errors:
              errors.array(),
          });
      }

      const {
        email,
        otp,
      } = req.body;

      const user =
        await authService.verifyOtp(
          email,
          otp
        );

      return res.status(200).json({
        success: true,
        message:
          "Account verified successfully",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   LOGIN
========================= */

const login = async (
  req,
  res
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors:
          errors.array(),
      });
    }

    const {
      email,
      password,
    } = req.body;

    const result =
      await authService.loginUser(
        email,
        password
      );

    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      accessToken:
        result.accessToken,
      refreshToken:
        result.refreshToken,
      user:
        result.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.message,
    });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */

const forgotPassword =
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      const result =
        await authService.forgotPassword(
          email
        );

      return res.status(200).json({
        success: true,
        message:
          "Password reset link generated successfully",
        resetToken:
          result.resetToken,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   RESET PASSWORD
========================= */

const resetPassword =
  async (req, res) => {
    try {
      const {
        token,
        newPassword,
      } = req.body;

      await authService.resetPassword(
        token,
        newPassword
      );

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   LOGOUT
========================= */

const logout =
  async (req, res) => {
    try {
      await authService.logoutUser(
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Logout successful",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  logout,
};