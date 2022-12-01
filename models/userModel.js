const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    userName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    phone : {
        type: Number,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    status : {
        type: String,
        default: 'Unblocked'
    },
    BookedVehicles:[{
     type:mongoose.Types.ObjectId,
     ref:'ProductData'
    }],
    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = UserModel = mongoose.model('UserData',userSchema);