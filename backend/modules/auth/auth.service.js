const authRepository =
  require(
    "./auth.repository"
  );
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* ===========================
   GENERATE ACCESS TOKEN
=========================== */

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "15m",
    }
  );
};

/* ===========================
   GENERATE REFRESH TOKEN
=========================== */

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:
        process.env.REFRESH_TOKEN_EXPIRE || "7d",
    }
  );
};

/* ===========================
   REGISTER USER
=========================== */

const registerUser = async (
  fullName,
  email,
  phoneNumber,
  password,
  gender
) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (!existingUser) {
    existingUser = await authRepository.findUserByPhoneNumber(phoneNumber);
  }

  if (existingUser) {
    throw new Error(
      "User already exists with email or phone number"
    );
  }

  if (existingUser) {
    throw new Error(
      "User already exists with email or phone number"
    );
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  const otpExpiry =
    new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    password,
    gender,
    otp,
    otpExpiry,
  });

  return {
    user,
    otp,
  };
};

/* ===========================
   VERIFY OTP
=========================== */

const verifyOtp = async (
  email,
  enteredOtp
) => {
  const user = await User.findOne({
    email,
  }).select("+otp +otpExpiry");

  if (!user) {
    throw new Error("User not found");
  }

  if (
    user.otp !== enteredOtp
  ) {
    throw new Error("Invalid OTP");
  }

  if (
    user.otpExpiry < new Date()
  ) {
    throw new Error("OTP expired");
  }

  user.isVerified = true;
  user.status = "ACTIVE";

  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return user;
};

/* ===========================
   LOGIN USER
=========================== */

const loginUser = async (
  email,
  password
) => {
  const user = await User.findOne({
    email,
  }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  if (!user.isVerified) {
    throw new Error(
      "Please verify your account first"
    );
  }

  const isPasswordMatched =
    await user.comparePassword(
      password
    );

  if (!isPasswordMatched) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);

  user.refreshToken =
    refreshToken;

  user.lastLogin =
    new Date();

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/* ===========================
   FORGOT PASSWORD
=========================== */

const forgotPassword =
  async (email) => {
    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const resetToken =
      jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

    user.passwordResetToken =
      resetToken;

    user.passwordResetExpiry =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save();

    return {
      user,
      resetToken,
    };
  };

/* ===========================
   RESET PASSWORD
=========================== */

const resetPassword =
  async (
    token,
    newPassword
  ) => {
    const user =
      await User.findOne({
        passwordResetToken:
          token,
      }).select(
        "+passwordResetToken +passwordResetExpiry"
      );

    if (!user) {
      throw new Error(
        "Invalid token"
      );
    }

    if (
      user.passwordResetExpiry <
      new Date()
    ) {
      throw new Error(
        "Reset token expired"
      );
    }

    user.password =
      newPassword;

    user.passwordResetToken =
      null;

    user.passwordResetExpiry =
      null;

    user.lastPasswordChangedAt =
      new Date();

    await user.save();

    return user;
  };

/* ===========================
   LOGOUT USER
=========================== */

const logoutUser =
  async (userId) => {
    const user =
      await User.findById(
        userId
      ).select(
        "+refreshToken"
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    user.refreshToken =
      null;

    await user.save();

    return true;
  };

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  generateAccessToken,
  generateRefreshToken,
};