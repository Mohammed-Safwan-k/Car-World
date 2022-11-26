const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const orderSchema = new mongoose.Schema({

    userId: {
        type: Objectid,
        required: true,
        ref: 'UserData'
    },

    product: {
        type: Objectid,
        required: true,
        ref: 'ProductData'
    },

    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = OrderModel = mongoose.model("OrderDatas", orderSchema)
