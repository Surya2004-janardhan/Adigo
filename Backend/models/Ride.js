const mongoose = require("mongoose");
// user_id, driver_id, pickup_location, drop_location, distance, fare, status, created_at

const rideSchema = new mongoose.Schema({
  rider_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },

  pickup_location: {
    type: String,
    required: true,
  },
  drop_location: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: Date,
  updatedAt: Date,
  paid: { type: Boolean, default: false }, // for payment status
});

module.exports = mongoose.model("Ride", rideSchema);
