const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId


const wishlistSchema = new mongoose.Schema({

    userId:{
        type: Objectid,
        required: true,
        ref: 'UserData'
    },
    productIds: {
        type:[Objectid],
        required: true,
        ref: 'ProductData'
    },
})

module.exports = Wishlist = mongoose.model("Wishlist", wishlistSchema)