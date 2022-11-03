const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('./configuration/connection');
const session = require('express-session');
const homeRoute = require("./routes/User");
const adminRoute = require("./routes/Admin");
const multer = require('multer')





const app = express();

// set view engine
app.set('views', path.join(__dirname, '/views'))  //or
// app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({dest: 'images'}).single('image'))


//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
}
))

//CACHE CONTROL
app.use((req, res, next) => {
    console.log('cache success');
    res.set("Cache-Control", "private,no-cache,no-store,must-revalidate");
    next();
})







//User route
// const { error } = require('console');
app.use("/", homeRoute);




// Admin route
app.use("/admin", adminRoute);




















//start server
app.listen(5000, () => {
    console.log('server started at port 5000');
})