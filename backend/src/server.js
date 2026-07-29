require("dotenv").config();

require("../config/firebase");




const app = require("./app");

const PORT = process.env.PORT || 5000;





app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});

setInterval(() => {
  console.log("Server is alive...");
}, 10000);


app.listen(PORT, () => {
    console.log(`
========================================
🚀 Server is running successfully
🌐 URL  : http://localhost:${PORT}
📦 Port : ${PORT}
========================================
`);
});

