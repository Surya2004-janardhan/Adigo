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
  vehical_Details: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  verified: {
    type: String,
  },
  is_available : {
    type: Boolean,
    default: true,
  },
  license_no : {
    type : String
  },
  current_location : {
    type : String
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
