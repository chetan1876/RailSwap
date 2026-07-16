const jwt = require("jsonwebtoken");
const User = require("./auth.model");

/*
=================================
REGISTER
=================================
*/

const register = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const user =
      await User.create({
        fullName,
        email,
        phoneNumber,
        password,
      });

    res.status(201).json({
      success: true,
      message:
        "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

/*
=================================
LOGIN
=================================
*/

const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Please register first",
      });
    }

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid password",
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

/*
=================================
GET PROFILE
=================================
*/

const getProfile =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await User.findById(
          req.user.id
        );

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  register,
  login,
  getProfile,
};