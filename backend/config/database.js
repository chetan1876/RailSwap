const mongoose = require("mongoose");

const connectDatabase = async () => {
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
};

module.exports = connectDatabase;