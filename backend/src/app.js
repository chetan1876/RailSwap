const express = require("express");
<<<<<<< Updated upstream
const cors = require("cors");

const authRoutes = require(
  "../modules/auth/auth.routes"
);
=======

const cors = require("../config/cors");
const helmet = require("../config/helmet");
const logger = require("../config/logger");
const rateLimit = require("../config/rateLimit");

const errorMiddleware = require("../middleware/error.middleware");

const womenSafetyRoutes = require("../modules/womenSafety/womenSafety.routes");
>>>>>>> Stashed changes

const app = express();

app.use(express.json());
<<<<<<< Updated upstream
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message:
      "RailSwap Backend Running Successfully",
  });
});

/* API Routes */
app.use(
  "/api/auth",
  authRoutes
);
=======

app.use(express.urlencoded({ extended: true }));

app.use(cors);

app.use(helmet);

app.use(logger);
app.use(rateLimit);

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "🚆 RailSwap Backend Running Successfully",
    });

});

app.use("/api/women-safety", womenSafetyRoutes);

app.use(errorMiddleware);
>>>>>>> Stashed changes

module.exports = app;