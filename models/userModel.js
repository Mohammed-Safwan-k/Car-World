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
    type : {
        type: String,
        default: 'user'
    }

})

module.exports = UserModel = mongoose.model('UserData',userSchema);