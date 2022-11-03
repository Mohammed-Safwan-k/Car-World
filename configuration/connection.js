// mongodb connect
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CarWorld');
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))