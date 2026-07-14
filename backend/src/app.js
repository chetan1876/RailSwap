<<<<<<< HEAD
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("RailSwap Backend Running...");
});

export default app;
=======
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
>>>>>>> a685674b9e2c45b496cabb8fd07833cbcfb77f34
