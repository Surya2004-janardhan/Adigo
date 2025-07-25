const express = require("express");
const router = express.Router();
const User = require("../models/User");
const middleware = require("../middleware/authMiddleware");
router.get("/profile", middleware, async (req, res) => {
  try {
    console.log("inside of profile route ");
    // get user roll no from token in the locastorage then fetch user profile all details
    const rollno = req.user.user;
    console.log(rollno);
    const user = await User.findOne({ rollno: rollno });
    if (user) {
      res
        .status(200)
        .json({ message: "Profile fetched successfully", user: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
