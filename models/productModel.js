const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const productSchema = new mongoose.Schema({
    type: {
        type: Objectid,
        required: true,
        ref: "VehicleData"
    },
    brand: {
        type: Objectid,
        required: true,
        ref: "BrandData"
    },
    fuelType: {
        type: Objectid,
        required: true,
        ref: "FuelData"
    },
    productName: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    advance: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: 'Unblocked'
    },
    sold: {
        type: String,
        default: 'Notsold'
    },
    date: {
        type: Date,
        default: Date.now
    },
    blockedDate: {
        type: Date,
        default: Date.now
    },




})

module.exports = ProductModel = mongoose.model('ProductData', productSchema);