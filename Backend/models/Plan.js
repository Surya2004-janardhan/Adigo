const mongoose = require (' mongoose')
dotenv.config();

const planSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    duration: String,
    category: String,
    createdAt: Date,
    updatedAt: Date
});

// testing with new branchgit may be this or that happens
module.exports = mongoose.model('Plan', planSchema);