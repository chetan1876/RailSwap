const User = require("./user.model");

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
FIND USER BY ID
========================================
*/

const findUserById = async (userId) => {
  return await User.findById(userId);
};

/*
========================================
FIND USER BY EMAIL
========================================
*/

const findUserByEmail = async (email) => {
  return await User.findOne({
    email,
  });
};

/*
========================================
FIND USER BY PHONE
========================================
*/

const findUserByPhone = async (
  phoneNumber
) => {
  return await User.findOne({
    phoneNumber,
  });
};

/*
========================================
UPDATE USER BY ID
========================================
*/

const updateUserById = async (
  userId,
  updateData
) => {
  return await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

/*
========================================
DELETE USER BY ID
========================================
*/

const deleteUserById = async (
  userId
) => {
  return await User.findByIdAndDelete(
    userId
  );
};

/*
========================================
SAVE USER DOCUMENT
========================================
*/

const saveUser = async (
  user
) => {
  return await user.save();
};

/*
========================================
FIND USER WITH PASSWORD
========================================
*/

const findUserWithPassword =
  async (email) => {
    return await User.findOne({
      email,
    }).select(
      "+password +refreshToken +otp +otpExpiry"
    );
  };

/*
========================================
FIND USER FOR PASSWORD RESET
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
GET ALL USERS
(Admin)
========================================
*/

const getAllUsers =
  async (
    page = 1,
    limit = 10
  ) => {
    const skip =
      (page - 1) * limit;

    const users =
      await User.find()
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1,
        });

    const total =
      await User.countDocuments();

    return {
      users,
      total,
      page,
      totalPages:
        Math.ceil(
          total / limit
        ),
    };
  };

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  updateUserById,
  deleteUserById,
  saveUser,
  findUserWithPassword,
  findUserByResetToken,
  getAllUsers,
};