const express = require("express");

const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, rollno, email, phonenumber, password } = req.body;
    if (name && rollno && email && phonenumber && password) {
      const user = await User.create({
        name,
        rollno,
        email,
        phonenumber,
        password,
      });
      const token = await jwt.sign(
        { user: user.rollno },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      res
        .status(201)
        .json({ message: "User created successfully", user: user, token });
      await localStorage.setItem("token", token);
      res
        .status(201)
        .json({ message: "User created successfully", user: user });
    } else {
      res.status(400).json({ message: "Please provide all details" });
    }
  } catch (error) {
    res.status(400).json({ message: "Incorrect details" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { rollno, password } = req.body;
    if (rollno && password) {
      const user = await User.findOne({ rollno: rollno });
      // for now direct checking + later add bcrypt hash to safe store passwords
      if (user && user.password === password) {
        res.status(200).json({ message: "Login successful", user: user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ message: "Please provide rollno and password" });
    }
  } catch (E) {
    res
      .status(500)
      .json({ message: "Internal server error", error: E.message });
  }
  // res.send(' route');
});

module.exports = router;
