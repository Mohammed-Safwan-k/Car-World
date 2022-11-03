const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
    fuelType: {
        type: String,
        required: true
    }
})

module.exports = FuelTypeModel = mongoose.model('FuelData',fuelSchema);