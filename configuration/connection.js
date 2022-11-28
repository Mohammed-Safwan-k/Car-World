// mongodb connect
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/CarWorld');
mongoose.connect("mongodb+srv://safwan_pklr:IoQteMvXR18SeM6u@cluster0.szlgm8q.mongodb.net/CarWorld?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true")
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// mongodb+srv://safwan_pklr:IoQteMvXR18SeM6u@cluster0.szlgm8q.mongodb.net/CarWorld