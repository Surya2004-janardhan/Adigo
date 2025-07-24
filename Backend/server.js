const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const profileRoutes = require("./routes/profileRoute.js");
const rides = require("./routes/ridesRoute.js");
// imported connection async func
const connecttoDB = require("./db/dbconnection.js");
const middleware = require("./middleware/authMiddleware.js");
const bookRoute = require("./routes/bookRideRoute.js");
const notificationRoutes = require("./routes/notificationRoute.js");
const paymentRoutes = require("./routes/paymentRoute.js");
const monthlyAutoShareRoute = require("./routes/monthlyAutoShareRoute.js");
// invoked connect to db async func to get proper connection for mongoDB
// wt a day to be so bad
connecttoDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

// app.use(middleware);

app.use("/auth", authRoutes);

app.use("/user", profileRoutes);
app.use("/user", rides);
app.use("/user", bookRoute);
app.use("/notification", notificationRoutes);
app.use("/payment", paymentRoutes);
app.use("/monthly-auto", monthlyAutoShareRoute);
// wt am i dng here, y did i exist
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("server ra Bujji, port 3000 antah ra Bujji");
});
