<<<<<<< HEAD
=======
<<<<<<< HEAD
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
require("dotenv").config();

const app = require("./app");

const connectDatabase = require("../config/database");

connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
>>>>>>> a685674b9e2c45b496cabb8fd07833cbcfb77f34
});
>>>>>>> 317acf5bddfb095d7f06cd085dc30fdd15905de1
