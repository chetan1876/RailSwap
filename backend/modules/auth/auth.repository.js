const User = require("../users/user.model");
const AuthModel = require("./auth.model");


/*
========================================
CREATE USER
========================================
*/

const createUser = async (userData) => {
  return await User.create(userData);
};

/*
========================================
FIND USER BY EMAIL
========================================
*/

const findUserByEmail = async (email) => {
  return await User.findOne({
    email: email.toLowerCase(),
  });
};

/*
========================================
FIND USER BY PHONE NUMBER
========================================
*/

const findUserByPhoneNumber = async (
  phoneNumber
) => {
  return await User.findOne({
    phoneNumber,
  });
};


/*
========================================
FIND USER BY EMAIL WITH PASSWORD
========================================
*/

const findUserForLogin = async (
  email
) => {
  return await User.findOne({
    email: email.toLowerCase(),
  }).select(
    "+password +refreshToken +otp +otpExpiry"
  );
};

/*
========================================
FIND USER FOR OTP VERIFICATION
========================================
*/

const findUserForOtpVerification =
  async (email) => {
    return await User.findOne({
      email: email.toLowerCase(),
    }).select(
      "+otp +otpExpiry"
    );
  };

/*
========================================
FIND USER BY RESET TOKEN
========================================
*/

const findUserByResetToken =
  async (token) => {
    return await User.findOne({
      passwordResetToken:
        token,
    }).select(
      "+passwordResetToken +passwordResetExpiry"
    );
  };

/*
========================================
UPDATE USER
========================================
*/

const updateUser = async (
  user
) => {
  return await user.save();
};

/*
========================================
UPDATE REFRESH TOKEN
========================================
*/

const updateRefreshToken =
  async (
    userId,
    refreshToken
  ) => {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );
  };

/*
========================================
REMOVE REFRESH TOKEN
========================================
*/

const removeRefreshToken =
  async (userId) => {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: null,
      }
    );
  };

/*
========================================
CHECK EMAIL EXISTS
========================================
*/

const emailExists = async (
  email
) => {
  const user =
    await User.exists({
      email:
        email.toLowerCase(),
    });

  return !!user;
};

/*
========================================
CHECK PHONE EXISTS
========================================
*/

const phoneExists = async (
  phoneNumber
) => {
  const user =
    await User.exists({
      phoneNumber,
    });

  return !!user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhoneNumber,
  findUserForLogin,
  findUserForOtpVerification,
  findUserByResetToken,
  updateUser,
  updateRefreshToken,
  removeRefreshToken,
  emailExists,
  phoneExists,
};