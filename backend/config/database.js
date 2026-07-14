const mongoose = require("mongoose");

const connectDatabase = async () => {
<<<<<<< Updated upstream
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: process.env.DB_NAME,
      }
    );

    console.log(
      `MongoDB Connected Successfully`
    );

    console.log(
      `Host: ${connection.connection.host}`
    );

    console.log(
      `Database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      "MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
=======
    try {

        console.log("🔄 Connecting to MongoDB...");
        console.log(process.env.MONGODB_URI);

        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);

    } catch (error) {

        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        process.exit(1);

    }
>>>>>>> Stashed changes
};

module.exports = connectDatabase;