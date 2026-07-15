<<<<<<< HEAD
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
=======
>>>>>>> a89dd23ba17aef4ff5b1f2ced7692719b057d3c5
