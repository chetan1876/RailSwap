<<<<<<< HEAD
<<<<<<< HEAD
 
const express = require("express");
const cors = require("cors");
// Extension ke sath load karein taaki module easily mil sake
const pnrRoutes = require("../modules/pnr/pnr.routes.js"); 
=======
'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const corsMiddleware = require('../config/cors');
const { generalLimiter } = require('../config/rateLimit');
const errorHandler = require('../middleware/errorHandler');

// Route modules
const authRoutes = require('../modules/auth/auth.routes');
const chatbotRoutes = require('../modules/chatbot/chatbot.routes');
const pnrRoutes = require('../modules/pnr/pnr.routes');
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef
=======
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
>>>>>>> de9d7e2c880c1176842d359e9693171c4969cd86

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RailSwap Backend Running Successfully",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
<<<<<<< HEAD
<<<<<<< HEAD
 
=======
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef
=======

>>>>>>> de9d7e2c880c1176842d359e9693171c4969cd86
