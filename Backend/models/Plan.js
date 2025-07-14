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
module.exports = mongoose.model('Plan', planSchema);