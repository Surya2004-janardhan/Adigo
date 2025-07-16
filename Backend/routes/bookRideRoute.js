const express = require("express");
const router = express.Router();
const User = require("../models/User");
const middleware = require("../middleware/authMiddleware");

const calculateDistance = (pickup_location, drop_location) => {
  // Implement this function to calculate distance between two locations
  const lat1 = parseFloat(pickup_location.split(",")[0]);
  const lon1 = parseFloat(pickup_location.split(",")[1]);
  const lat2 = parseFloat(drop_location.split(",")[0]);
  const long1 = parseFloat(pickup_location.split(",")[2]);
  // const lat2 = parseFloat(drop_location.split(',')[0]);
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(long2 - long1, 2));
};

const calculateFare = (distance) => {
  // Implement this function to calculate fare based on distance
  return distance * 5; // Example fare calculation
};
router.post("/bookRide", middleware, async (req, res) => {
  try {
    const { pickup_location, drop_location } = req.body;
    const userId = req.user.id;
    const distance = calculateDistance(pickup_location, drop_location); // Implement this function
    const fare = calculateFare(distance); // Implement this function

    if (!pickup_location || !drop_location) {
      return res
        .status(400)
        .json({ message: "Pickup and drop location are required" });
    }

    // Create ride with no driver assigned yet
    const ride = new Ride({
      user_id: userId,
      pickup_location,
      drop_location,
      fare,
      driver_id: null, // no driver assigned yet
      status: "pending", // wait for driver to accept
      created_at: new Date(),
    });

    await ride.save();

    res.status(201).json({
      message: "Ride request created. Waiting for driver to accept.",
      ride_id: ride._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/accept/:rideId", middleware, async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const driverId = req.user.id; // From token (driver login)

    const ride = await Ride.findById(rideId);

    if (!ride || ride.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Invalid or already accepted ride" });
    }

    ride.driver_id = driverId;
    ride.status = "accepted";
    await ride.save();

    res.json({ message: "Ride accepted successfully", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
