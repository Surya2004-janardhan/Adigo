const mongoose = require("mongoose");
// const dotenv = require("dotenv");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI)
const connecttoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connecttoDB;
