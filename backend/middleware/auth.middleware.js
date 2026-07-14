const jwt = require("jsonwebtoken");

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token;

    /*
      Authorization Header Format

      Bearer eyJhbGciOiJIUzI1Ni...
    */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please login first.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access token expired. Please login again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};

module.exports =
  authMiddleware;