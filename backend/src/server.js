<<<<<<< HEAD
<<<<<<< HEAD


const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database"); // Path check kar lena aapka database folder kahan hai
=======
'use strict';
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef
=======
>>>>>>> de9d7e2c880c1176842d359e9693171c4969cd86

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

