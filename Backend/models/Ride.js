const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driver: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Ride', rideSchema);