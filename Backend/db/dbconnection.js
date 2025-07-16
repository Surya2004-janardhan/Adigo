const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI =
  "mongodb+srv://chintalajanardhan2004:123@cluster0.dm083rc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connecttoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connecttoDB;
