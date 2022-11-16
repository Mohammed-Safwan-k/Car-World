const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/vehicletypeModel")
const FuelModel = require('../models/fueltypeModel')
const Wishlist = require('../models/wishlistModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")


//----------------------------------------- START OTP ----------------------------------------------------------
// Email OTP Verification

var FullName;
var UserName;
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',

  auth: {
    user: 'keralaexoticmotor@gmail.com',
    pass: 'mfrmympahosohasq',
  }

});



var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);


//**************************************** END OTP **************************************************//


module.exports = {




  // User home page
  home: (req, res) => {
    // res.send("You just created a User ...!!!");
    if (req.session.userLogin) {
      res.render("user/home", { login: true, user: req.session.user });
    } else {
      res.render('user/home', { login: false });
    }
  },

  // User signin page
  signin: (req, res) => {
    if (!req.session.userLogin) {
      res.render('user/signin');
    } else {
      res.redirect('/')
    }
  },


  //**********************************SIGNUP USER *******************************************/

  // OTP
  otp: async (req, res) => {

    FullName = req.body.fullName
    UserName = req.body.userName
    Email = req.body.email;
    Phone = req.body.phone
    Password = req.body.password

    const user = await UserModel.findOne({ email: Email });

    if (!user) {
      // send mail with defined transport object
      var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('user/otp');
      });

    }
    else {
      res.redirect('/signin')
    }

  },


  resendotp: (req, res) => {
    var mailOptions = {
      to: Email,
      subject: "Otp for registration is: ",
      html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('user/otp', { msg: "otp has been sent" });
    });
  },


  verifyotp: (req, res) => {

    if (req.body.otp == otp) {
      // res.send("You has been successfully registered");

      const newUser = UserModel(
        {
          fullName: FullName,
          userName: UserName,
          email: Email,
          phone: Phone,
          password: Password,
        }
      );
      console.log(req.body);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(() => {
              res.redirect("/signin");
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/signin")
            })
        })
      })

    }
    else {
      res.render('user/otp', { msg: 'otp is incorrect' });
    }
  },


  //***************************************** END SIGNUP USER ****************************************/


  //signin
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ $and: [{ email: email }, { status: "Unblocked" }] });
    if (!user) {
      return res.redirect('/signin');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/signin');
    }
    req.session.user = user.userName
    req.session.userId = user._id
    req.session.userLogin = true;
    res.render('user/home', { login: true, user: user.userName });
  },


  // All Product
  allproductpage: async (req, res) => {
    const products = await ProductModel.find({}).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
    console.log(products)
    res.render('user/allProducts', { login: true, user: req.session.user, products })

  },


  // Single Product
  singleProductpage: async (req, res) => {
    const product = await ProductModel.findById({ _id: req.params.id }).populate('type').populate('brand').populate('fuelType')
    console.log(product);
    res.render('user/singleProduct', { login: true, user: req.session.user, product })
  },


  // Add to Wishlist
  addtowishlist: async (req, res) => {
    let productId = req.params.productId
    let userId = req.session.userId   //user id
    let wishlist = await Wishlist.findOne({ userId })

    if (wishlist) {
      await Wishlist.findOneAndUpdate({ userId: userId }, { $addToSet: { productIds: productId } })
      res.redirect('/allproductpage')
    }
    else {
      const newwishlist = new Wishlist({ userId, productIds: [productId] })
      newwishlist.save()
        .then(() => {
          res.redirect('/allproductpage')
        })
    }


  },


  // Wishlist Page
  wishlist: async (req, res) => {
    
    let userId = req.session.userId;
    console.log(userId)
    let list = await Wishlist.findOne({ userId: userId }).populate('productIds').populate('productIds.$.brand')
    console.log(list)
    if(list){
      let wish = list.productIds
      if (req.session.userLogin) {
        res.render("user/wishlist", {login: true, user: req.session.user, wish, index:1})
      }else {
        res.redirect('/signin')
      }
    }

  },

















  //signup
  // signup: async (req, res) => {

  //   const newUser = UserModel(req.body
  //     //   {
  //     //   fullName: req.body.fullName,
  //     //   userName: req.body.userName,
  //     //   email: req.body.email,
  //     //   phone: req.body.phone,
  //     //   password: req.body.password
  //     // }
  //   );
  //   console.log(req.body);

  //   bcrypt.genSalt(10, (err, salt) => {
  //     bcrypt.hash(newUser.password, salt, (err, hash) => {
  //       if (err) throw err;
  //       newUser.password = hash;

  //       newUser
  //         .save()
  //         .then(() => {
  //           res.redirect("/signin");
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           res.redirect("/signin")
  //         })
  //     })
  //   })
  // },





  //-------------------------------------------------------------------------
  // LOG OUT



  logout: (req, res) => {
    req.session.loggedOut = true;
    // if(req.session.loggedOut){
    req.session.destroy()
    res.redirect('/')
    // }
  }

};
