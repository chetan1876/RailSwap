const userRepository = require("../users/user.repository");
const AuthModel = require("./auth.model");


/*
========================================
CREATE USER
========================================
*/

const createUser = async (userData) => {
  return await userRepository.createUser(userData);
};

/*
========================================
FIND USER BY EMAIL
========================================
*/

const findUserByEmail = async (email) => {
  return await userRepository.findUserByEmail(email);
};

/*
========================================
FIND USER BY PHONE NUMBER
========================================
*/

const findUserByPhoneNumber = async (
  phoneNumber
) => {
  return await userRepository.findUserByPhone(phoneNumber);
};


/*
========================================
FIND USER BY EMAIL WITH PASSWORD
========================================
*/

const findUserForLogin = async (
  email
) => {
  return await userRepository.findUserByEmail(email);
};

/*
========================================
FIND USER FOR OTP VERIFICATION
========================================
*/

const findUserForOtpVerification =
  async (email) => {
    return await userRepository.findUserByEmail(email);
  };

/*
========================================
FIND USER BY RESET TOKEN
========================================
*/

const findUserByResetToken =
  async (token) => {
    return await userRepository.findUserByResetToken(token);
  };

/*
========================================
UPDATE USER
========================================
*/

const updateUser = async (
  user
) => {
  return await userRepository.saveUser(user);
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
    return await userRepository.updateUserById(
      userId,
      {
        refreshToken,
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
    return await userRepository.updateUserById(
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
    await userRepository.findUserByEmail(
      email
    );

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
    await userRepository.findUserByPhone(
      phoneNumber
    );

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