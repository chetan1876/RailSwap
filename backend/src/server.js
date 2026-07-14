require("dotenv").config();

const app = require("./app");

const connectDatabase = require("../config/database");

connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});