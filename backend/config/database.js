<<<<<<< HEAD
=======
<<<<<<< HEAD
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Industry Best Practice: Connection options handle karna fallback local URL ke sath
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railswap';
        
        await mongoose.connect(mongoURI);
        console.log('📦 MongoDB connected successfully to RailSwap Cluster.');
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1); // App crash hone se behtar hai cluster error pe server exit karein
    }
};

module.exports = connectDB;
=======
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
>>>>>>> a685674b9e2c45b496cabb8fd07833cbcfb77f34
>>>>>>> 317acf5bddfb095d7f06cd085dc30fdd15905de1
