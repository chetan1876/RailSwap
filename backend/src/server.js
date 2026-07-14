<<<<<<< Updated upstream
=======
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database"); // Path check kar lena aapka database folder kahan hai

dotenv.config();

// Database connect karein
connectDatabase();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
>>>>>>> Stashed changes
