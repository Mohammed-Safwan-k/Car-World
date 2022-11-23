const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    }


})

module.exports = BannerModel = mongoose.model('BannerData', bannerSchema);