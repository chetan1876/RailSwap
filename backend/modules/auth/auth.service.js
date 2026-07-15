<<<<<<< HEAD
const authRepository =
  require(
    "./auth.repository"
  );
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
=======
'use strict';
>>>>>>> a89dd23ba17aef4ff5b1f2ced7692719b057d3c5

const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const ApiError = require('../../shared/apiError');
const { logger } = require('../../shared/logger');

class AuthService {
  /**
   * Register a new user and return JWT tokens.
   * @param {{name:string, email:string, password:string, phone?:string}} data
   */
  async register(data) {
    const { name, email, password, phone } = data;

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw ApiError.conflict('An account with this email already exists.');
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    logger.info('New user registered', { userId: user._id, email: user.email });

    const tokens = this._generateTokens(user);
    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Authenticate user credentials and return JWT tokens.
   * @param {{email:string, password:string}} data
   */
  async login(data) {
    const { email, password } = data;

    // Explicitly select password (select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    logger.info('User logged in', { userId: user._id });

    const tokens = this._generateTokens(user);
    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Generate access and refresh JWT tokens.
   * @param {import('./auth.model')} user
   */
  _generateTokens(user) {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
<<<<<<< HEAD
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
=======
>>>>>>> a89dd23ba17aef4ff5b1f2ced7692719b057d3c5
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
