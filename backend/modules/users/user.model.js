const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    /* Basic Information */
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    /* Profile Information */
    profileImage: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "OTHER",
    },

    age: {
      type: Number,
      min: 0,
      max: 120,
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    /* Authentication */
    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
      select: false,
    },

    otpExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    /* Role Based Access Control */
    role: {
      type: String,
      enum: [
        "USER",
        "ADMIN",
        "MODERATOR",
        "SUPER_ADMIN",
      ],
      default: "USER",
    },

    permissions: {
      type: [String],
      default: [],
    },

    /* Security */
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    accountLockedUntil: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    lastPasswordChangedAt: {
      type: Date,
      default: null,
    },

    /* RailSwap Specific Fields */
    trustScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    totalTrips: {
      type: Number,
      default: 0,
    },

    successfulExchanges: {
      type: Number,
      default: 0,
    },

    cancelledExchanges: {
      type: Number,
      default: 0,
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },
    },

    /* Account Status */
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "SUSPENDED",
        "BLOCKED",
        "PENDING_VERIFICATION",
      ],
      default: "PENDING_VERIFICATION",
    },
  },
  {
    timestamps: true,
  }
);

/* Hash Password Before Saving */

userSchema.pre(
  "save",
  async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(
      this.password,
      12
    );

    next();
  }
);

/* Compare Password */

userSchema.methods.comparePassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

/* Remove Sensitive Data */

userSchema.methods.toJSON =
  function () {
    const user = this.toObject();

    delete user.password;
    delete user.otp;
    delete user.refreshToken;
    delete user.passwordResetToken;

    return user;
  };

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;