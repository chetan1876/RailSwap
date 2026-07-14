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
