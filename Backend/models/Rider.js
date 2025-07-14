const mongoose = require("mongoose");

const riderschema = new mongoose.Schema({
  name: String,
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // role: String,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Rider", riderschema);
