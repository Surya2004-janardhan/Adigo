const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const MonthlyAutoShare = require("../models/MonthlyAutoShare");

// Join or create a monthly auto share
router.post("/join", authMiddleware, async (req, res) => {
  const { month, from, to, time_morning, time_evening } = req.body;
  const user_id = req.user.rollno;

  // Find existing active group for this route/month
  let group = await MonthlyAutoShare.findOne({
    month,
    from,
    to,
    time_morning,
    time_evening,
    status: "active",
    $where: "this.members.length < 10",
  });

  if (!group) {
    // Create new group
    group = await MonthlyAutoShare.create({
      user_id,
      month,
      from,
      to,
      time_morning,
      time_evening,
      package_price: 1000, // Example price, you can calculate dynamically
      members: [user_id],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.json({ message: "Joined new auto share", group });
  }

  // Check if user already joined
  if (group.members.includes(user_id)) {
    return res
      .status(400)
      .json({ message: "Already joined this auto share", group });
  }

  // Add user to group
  group.members.push(user_id);
  group.updatedAt = new Date();
  await group.save();

  res.json({ message: "Joined existing auto share", group });
});

// Get user's current monthly auto share
router.get("/my", authMiddleware, async (req, res) => {
  const user_id = req.user.rollno;
  const group = await MonthlyAutoShare.findOne({
    members: user_id,
    status: "active",
  });
  if (!group)
    return res.status(404).json({ message: "No active auto share found" });
  res.json({ group });
});

// List all available monthly auto shares (for matching)
router.get("/all", authMiddleware, async (req, res) => {
  const groups = await MonthlyAutoShare.find({ status: "active" });
  res.json({ groups });
});

module.exports = router;
