const authService = require("./auth.service");

/*
========================================
REGISTER
========================================
*/

const register = async (
  req,
  res,
  next
) => {
  try {
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

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
VERIFY OTP
========================================
*/

const verifyOtp = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    const result =
      await authService.verifyOtp(
        email,
        otp
      );

    res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
LOGIN
========================================
*/

const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const result =
      await authService.loginUser(
        email,
        password
      );

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
FORGOT PASSWORD
========================================
*/

const forgotPassword =
  async (
    req,
    res,
    next
  ) => {
    try {
      const { email } =
        req.body;

      const result =
        await authService.forgotPassword(
          email
        );

      res.status(200).json({
        success: true,
        message:
          "Password reset token generated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

/*
========================================
LOGOUT
========================================
*/

const logout = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await authService.logoutUser(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
========================================
GET CURRENT USER
========================================
*/

const getMe = async (
  req,
  res,
  next
) => {
  try {
    const User =
      require(
        "./auth.model"
      );

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "User not found",
        });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  logout,
  getMe,
};