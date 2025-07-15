// ride_id, amount, status, transaction_id, mode, paid_at;
const mongoose = require("mongoose");

const paymentSchema = new mongoose.schema({
  ride_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  paid_at: {
    type: Date,
    required: true,
  },
  created_at: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Payment", paymentSchema);
