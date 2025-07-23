const mongoose = require("mongoose");

const monthlyAutoShareSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  month: { type: String, required: true }, // e.g., "2024-07"
  from: { type: String, required: true }, // Home location
  to: { type: String, required: true }, // College location
  time_morning: { type: String, required: true }, // e.g., "08:00"
  time_evening: { type: String, required: true }, // e.g., "17:00"
  package_price: { type: Number, required: true },
  members: [{ type: String }], // user_ids of all members in this auto
  status: { type: String, default: "active" }, // active, completed, cancelled
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("MonthlyAutoShare", monthlyAutoShareSchema);
