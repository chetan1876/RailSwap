<<<<<<< Updated upstream
=======
const express = require("express");
const cors = require("cors");
// Extension ke sath load karein taaki module easily mil sake
const pnrRoutes = require("../modules/pnr/pnr.routes.js"); 

const app = express();

app.use(cors());
app.use(express.json());

// PNR routes connect kiya
app.use("/api/pnr", pnrRoutes);

app.get("/", (req, res) => {
    res.send("RailSwap Backend Running...");
});

module.exports = app;
>>>>>>> Stashed changes
