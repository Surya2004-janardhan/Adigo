// driver_id, lat, lng, updated_at

const mongoose = require("mongoose");

const liveLocationSchema = new mongoose.Schema({
  driver_id: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("LiveLocation", liveLocationSchema);
