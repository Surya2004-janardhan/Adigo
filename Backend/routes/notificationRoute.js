const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/push-token", authMiddleware, async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "No token provided" });
  const user = await User.findOneAndUpdate(
    { rollno: req.user.rollno },
    { expoPushToken: token },
    { new: true }
  );
  res.json({ message: "Push token saved", token });
});

router.post("/send", authMiddleware, async (req, res) => {
  const { rollno, title, body } = req.body;
  const user = await User.findOne({ rollno });
  if (!user || !user.expoPushToken)
    return res.status(404).json({ message: "User or token not found" });

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: user.expoPushToken,
      title,
      body,
      sound: "default",
    }),
  });
  res.json({ message: "Notification sent" });
});

module.exports = router;
