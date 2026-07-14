require("dotenv").config();

const app = require("./app");

const connectDatabase = require("../config/database");

<<<<<<< Updated upstream
connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});
=======
const PORT = process.env.PORT || 5000;

(async () => {

    await connectDatabase();

    app.listen(PORT, () => {

        console.log(`🚀 Server Running On Port ${PORT}`);

    });

})();
>>>>>>> Stashed changes
