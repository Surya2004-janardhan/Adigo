const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const authRoutes = require('./routes/authRoute.js');
// imported connection async func
const connecttoDB = require('./db/dbconnection.js');
const middleware = require('./middleware/authMiddleware.js');
// invoked connect to db async func to get proper connection for mongoDB
connecttoDB()

const app = express();

app.use(cors())

app.use(express.json())

app.use(middleware)


app.use('/auth' , authRoutes)

app.use(bodyParser.urlencoded({ extended: true }));

