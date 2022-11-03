const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    }
})

module.exports = BrandModel = mongoose.model('BrandData',brandSchema);