require("dotenv").config();

const app = require("./app");
const connectDatabase = require("../config/database");

// Connect Database
connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});