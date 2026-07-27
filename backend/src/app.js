require("dotenv").config();

const womenSafetyRoutes = require("../modules/womenSafety/womenSafety.routes");
const emergencyMedicalRoutes = require("../modules/emergencyMedical/emergencyMedical.routes");
const notificationRoutes = require("../modules/notification/notification.routes");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("../modules/auth/auth.routes");
// const userRoutes = require("../modules/users/user.routes");

const app = express();

/*
========================================
MIDDLEWARES
========================================
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

/*
========================================
API ROUTES
========================================
*/

app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/women-safety",
  womenSafetyRoutes
);
app.use(
  "/api/emergency-medical",
  emergencyMedicalRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
/*
========================================
HEALTH CHECK
========================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RailSwap Backend Running Successfully",
  });
});

/*
========================================
API ROUTES
========================================
*/


/*
========================================
404 HANDLER
========================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
========================================
GLOBAL ERROR HANDLER
========================================
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
});

module.exports = app;