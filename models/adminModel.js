const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        default: 'admin'
    }

})

module.exports = AdminModel = mongoose.model('AdminData',adminSchema);