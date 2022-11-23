const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const orderSchema = new mongoose.Schema({

    userId: {
        type: Objectid,

    },

    amount:{
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    
})

module.exports = OrderModel = mongoose.model("OrderDatas", orderSchema)
