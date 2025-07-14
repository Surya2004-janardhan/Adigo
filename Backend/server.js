const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')

// imported connection async func
const connecttoDB = require('./db/dbconnection.js');
// invoked connect to db async func to get proper connection for mongoDB
connecttoDB()

const app = express();

app.use(cors())

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }));

