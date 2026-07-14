const express = require("express");
const cors = require("cors");

const authRoutes = require(
  "../modules/auth/auth.routes"
);

const app = express();

app.use(express.json());
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

module.exports = app;