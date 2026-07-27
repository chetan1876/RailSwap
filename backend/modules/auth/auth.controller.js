const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../config/firebase");

/*
=================================
REGISTER
=================================
*/

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userRef = db
      .collection("users")
      .doc(email);

    const existingUser =
      await userRef.get();

    if (existingUser.exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const userData = {
      fullName,
      email,
      phoneNumber,
      password:
        hashedPassword,
      role: "USER",
      createdAt:
        new Date(),
    };

    await userRef.set(
      userData
    );

    const token =
      jwt.sign(
        {
          email,
          role: "USER",
        },
        process.env.JWT_SECRET,
        {
          expiresIn:
            "7d",
        }
      );

    return res.status(201).json({
      success: true,
      token,
 user: {
  id: email,
  fullName,
  email,
  phoneNumber,
  role: "USER",
},
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
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

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const userDoc =
      await db
        .collection("users")
        .doc(email)
        .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const user =
      userDoc.data();

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
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
          email:
            user.email,
          role:
            user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn:
            "7d",
        }
      );

    return res.status(200).json({
      success: true,
      token,
      user: {
  id: user.email,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
},
     
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {
  register,
  login,
};