const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    typeName: {
        type: String,
        required: true
    }
})

module.exports = TypeModel = mongoose.model('VehicleData',typeSchema);