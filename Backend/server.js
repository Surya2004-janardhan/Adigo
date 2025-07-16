const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const profileRoutes = require("./routes/profileRoute.js");
const rides = require('./routes/ridesRoute.js')
// imported connection async func
const connecttoDB = require("./db/dbconnection.js");
const middleware = require("./middleware/authMiddleware.js");
const bookRoute = require('./routes/bookRideRoute.js')
// invoked connect to db async func to get proper connection for mongoDB
connecttoDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(middleware);

app.use("/auth", authRoutes);

app.use("/user", profileRoutes);
app.use("/user", rides);
app.use('/user' , bookRoute)

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("server ra bujji port 3000 ra bujji");
});
