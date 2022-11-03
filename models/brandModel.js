const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    fuelType: {
        type: String,
        required: true
    }
})

module.exports = BrandModel = mongoose.model('BrandData',brandSchema);