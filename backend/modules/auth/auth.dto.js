/*
========================================
REGISTER RESPONSE DTO
========================================
*/

const registerResponseDTO = (
  user
) => {
  return {
    id: user._id,

    fullName:
      user.fullName,

    email:
      user.email,

    phoneNumber:
      user.phoneNumber,

    role:
      user.role,

    isVerified:
      user.isVerified,

    status:
      user.status,

    createdAt:
      user.createdAt,
  };
};

/*
========================================
LOGIN RESPONSE DTO
========================================
*/

const loginResponseDTO = (
  user,
  accessToken,
  refreshToken
) => {
  return {
    accessToken,

    refreshToken,

    user: {
      id: user._id,

      fullName:
        user.fullName,

      email:
        user.email,

      profileImage:
        user.profileImage,

      role:
        user.role,

      trustScore:
        user.trustScore,

      isVerified:
        user.isVerified,

      status:
        user.status,
    },
  };
};

/*
========================================
VERIFY OTP RESPONSE DTO
========================================
*/

const verifyOtpResponseDTO =
  (user) => {
    return {
      id: user._id,

      fullName:
        user.fullName,

      email:
        user.email,

      isVerified:
        user.isVerified,

      status:
        user.status,
    };
  };

/*
========================================
FORGOT PASSWORD DTO
========================================
*/

const forgotPasswordDTO =
  () => {
    return {
      message:
        "Password reset email sent successfully.",
    };
  };

/*
========================================
RESET PASSWORD DTO
========================================
*/

const resetPasswordDTO =
  () => {
    return {
      message:
        "Password reset successful.",
    };
  };

/*
========================================
LOGOUT DTO
========================================
*/

const logoutDTO =
  () => {
    return {
      message:
        "Logout successful.",
    };
  };

module.exports = {
  registerResponseDTO,
  loginResponseDTO,
  verifyOtpResponseDTO,
  forgotPasswordDTO,
  resetPasswordDTO,
  logoutDTO,
};