const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Ride = require("../models/Ride");

router.post("/razorpay", authMiddleware, async (req, res) => {
  const { rideId, amount } = req.body;
  // Here, integrate with Razorpay SDK to create an order and return order details
  // For now, just simulate success
  // Mark ride as paid in DB
  await Ride.findByIdAndUpdate(rideId, { paid: true });
  res.json({ message: "Payment successful (dummy)", paid: true });
});

module.exports = router;
