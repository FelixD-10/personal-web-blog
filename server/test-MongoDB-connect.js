const mongoose = require("mongoose");

// thay bằng connection string của bạn
const MONGO_URI = "mongodb+srv://admin_blog:YmRdtkOkKfJXYmln@cluster0.raqhrwz.mongodb.net/blog?retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully!");

    // lấy trạng thái connection
    console.log("Connection state:", mongoose.connection.readyState);

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  }
}

testConnection();