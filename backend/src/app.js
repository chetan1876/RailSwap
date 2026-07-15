<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");

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
=======
>>>>>>> a89dd23ba17aef4ff5b1f2ced7692719b057d3c5
