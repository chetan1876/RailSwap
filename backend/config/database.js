const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log("Mongo URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:");
    console.log(error.message);

    process.exit(1);
  }
};

module.exports = connectDatabase;