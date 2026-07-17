const jwt = require("jsonwebtoken");
const { db } = require("../../config/firebase");
const bcrypt = require("bcryptjs");
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

    const userRef = db
      .collection("users")
      .doc(email);

    const existingUser =
      await userRef.get();

    if (existingUser.exists) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await userRef.set({
      fullName,
      email,
      phoneNumber,
      password:
        hashedPassword,
      role: "USER",
      createdAt:
        new Date(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",
    });
  } catch (error) {
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
          "Please register first",
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
        fullName:
          user.fullName,
        email:
          user.email,
        phoneNumber:
          user.phoneNumber,
        role:
          user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
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
      const userDoc =
        await db
          .collection("users")
          .doc(
            req.user.email
          )
          .get();

      return res.json({
        success: true,
        user:
          userDoc.data(),
      });
    } catch (error) {
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
  getProfile,
};