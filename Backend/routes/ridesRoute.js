const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const User = require("../models/User");
router.get("/rides", middleware, async (req, res) => {
  try {
    // get user roll no from token in the locastorage then fetch user profile all details
    const rollno = req.user.rollno;
    const user = await User.findOne({ rollno: rollno });
    if (user) {
      res.status(200).json({
        message: "User Rides fetched successfully",
        user_rides: user.rides_history,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.patch("/complete/:ride_id", middleware, async (req, res) => {
  try {
    const ride_id = req.params.ride_id;
    const ride = await Ride.findOne({ id: ride_id });
    if (ride) {
      ride.status = "completed";
      await ride.save();
      res.status(200).json({ message: "Ride completed successfully" });
    } else {
      res.status(404).json({ message: "Ride not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.patch("/cancle/:ride_id", middleware, async (req, res) => {
  try {
    const ride_id = req.params.ride_id;
    const ride = await Ride.findOne({ id: ride_id });
    if (ride) {
      ride.status = "cancled";
      await ride.save();
      res.status(200).json({ message: "Ride cancled successfully" });
    } else {
      res.status(404).json({ message: "Ride not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
