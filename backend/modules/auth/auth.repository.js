
const userRepository = require("../users/user.repository");
const AuthModel = require("./auth.model");

const { db } = require("../../config/firebase");


const COLLECTION = "users";

/* =====================================================
                    CREATE USER
===================================================== */

const createUser = async (userData) => {

  return await userRepository.createUser(userData);


    const docRef = db.collection(COLLECTION).doc();

    const data = {
        uid: docRef.id,
        ...userData,
    };

    await docRef.set(data);

    return data;


};

/* =====================================================
                GET USER BY UID
===================================================== */

const getUserByUID = async (uid) => {

    const snapshot = await db
        .collection(COLLECTION)
        .where("uid", "==", uid)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();


const findUserByEmail = async (email) => {
  return await userRepository.findUserByEmail(email);

};

/* =====================================================
                GET USER BY EMAIL
===================================================== */

const getUserByEmail = async (email) => {

    const snapshot = await db
        .collection(COLLECTION)
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    return snapshot.docs[0].data();

};

/* =====================================================
                SAVE OTP
===================================================== */

const saveOTP = async (uid, otp, otpExpiry) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            otp,

            otpExpiry,

            updatedAt: new Date(),

        });

};

/* =====================================================
            SAVE RESET OTP
===================================================== */

const saveResetOTP = async (

    uid,

    resetOTP,

    resetOTPExpiry

) => {

  return await userRepository.findUserByPhone(phoneNumber);


    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            resetOTP,

            resetOTPExpiry,

            updatedAt: new Date(),

        });


};

/* =====================================================
                VERIFY EMAIL
===================================================== */

const verifyEmail = async (uid) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            emailVerified: true,

            status: "ACTIVE",

            otp: null,

            otpExpiry: null,

            updatedAt: new Date(),

        });


const findUserForLogin = async (
  email
) => {
  return await userRepository.findUserByEmail(email);


};

/* =====================================================
            UPDATE LOGIN INFO
===================================================== */
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

const updateLoginInfo = async (
    uid,
    refreshToken,
    lastLogin
) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            refreshToken,

            lastLogin,

            updatedAt: new Date(),

        });


};

/* =====================================================
            REMOVE REFRESH TOKEN
===================================================== */


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

const removeRefreshToken = async (uid) => {


    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({


const removeRefreshToken =
  async (userId) => {
    return await userRepository.updateUserById(
      userId,
      {
        refreshToken: null,
      }
    );
  };

            refreshToken: null,

            updatedAt: new Date(),


const emailExists = async (
  email
) => {
  const user =
    await userRepository.findUserByEmail(
      email
    );

        });


};

/* =====================================================
                UPDATE PASSWORD
===================================================== */

const updatePassword = async (

    uid,

    password

) => {

  const user =
    await userRepository.findUserByPhone(
      phoneNumber
    );



    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            password,

            updatedAt: new Date(),

        });

};

/* =====================================================
            CLEAR RESET OTP
===================================================== */

const clearResetOTP = async (uid) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .update({

            resetOTP: null,

            resetOTPExpiry: null,

            updatedAt: new Date(),

        });

};

/* =====================================================
                DELETE USER
===================================================== */

const deleteUser = async (uid) => {

    await db
        .collection(COLLECTION)
        .doc(uid)
        .delete();

};

module.exports = {

    createUser,

    getUserByUID,

    getUserByEmail,

    saveOTP,

    saveResetOTP,

    verifyEmail,

    updateLoginInfo,

    removeRefreshToken,

    updatePassword,

    clearResetOTP,

    deleteUser,

};