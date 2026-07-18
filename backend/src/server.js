require("dotenv").config();

<<<<<<< Updated upstream
require("../config/firebase");

=======
>>>>>>> Stashed changes
const app = require("./app");

const PORT = process.env.PORT || 5000;

<<<<<<< Updated upstream
app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
=======
// app.listen(PORT, () => {
//   console.log(`🚀 Server Running On Port ${PORT}`);
// });
app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});

setInterval(() => {
  console.log("Server is alive...");
}, 10000);
>>>>>>> Stashed changes
