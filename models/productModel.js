const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type : {
        type: String,
        required: true
    },
    brand : {
        type: String,
        required: true
    },
    fuelType : {
        type: String,
        required: true
    },
    productName : {
        type: String,
        required: true,
    },
    discription : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    image : {
        type: Array,
        required: true
    }
    

})

module.exports = ProductModel = mongoose.model('ProductData',productSchema);