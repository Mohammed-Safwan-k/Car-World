const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const blockedcarSchema = new mongoose.Schema({

    userId:{
        type: Objectid,
        required: true,
        ref: 'UserData'
    },
    productIds: {
        type: Objectid,
        required: true,
        ref: 'ProductData'
    },
    
})

module.exports = BlockedCarModel = mongoose.model("BlockedDatas", blockedcarSchema)
