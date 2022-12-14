const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/vehicletypeModel")
const FuelModel = require('../models/fueltypeModel')
const Wishlist = require('../models/wishlistModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const OrderModel = require("../models/orderModel")
const BannerModel = require("../models/bannerModel");
// const { default: mongoose } = require("mongoose");
const Razorpay = require('razorpay')
const mongoose = require('mongoose');
const { nextTick } = require("process");






//********************************************* START OTP **************************************************//
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
    user: 'carworldmotors2020@gmail.com',
    pass: 'iqbfuteaqznxooma',
  }

});



var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);


//********************************************* END OTP **************************************************//


module.exports = {

  // DEMO
  // demo: (req, res) => {
  //   try {
  //     res.render('user/profile', { login: true, user: req.session.user })

  //   } catch (err) {
  //     next(err)
  //   }
  // },




  // User home page
  home: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const banner = await BannerModel.find()
        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).limit(6)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        res.render("user/home", { login: true, user: req.session.user, banner, products, brand, fuel, type });
      } else {
        const banner = await BannerModel.find()
        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).limit(6)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        res.render('user/home', { login: false, banner, products, brand, fuel, type });
      }

    } catch (err) {
      next(err)
    }
    // res.send("You just created a User ...!!!");
  },

  // User signin page
  signin: (req, res) => {
    try {
      if (!req.session.userLogin) {
        res.render('user/signin');
      } else {
        res.redirect('/')
      }

    } catch (err) {
      next(err)
    }
  },


  //**********************************SIGNUP USER *******************************************/

  // OTP
  otp: async (req, res) => {
    try {
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

    } catch (err) {
      next(err)
    }


  },


  resendotp: (req, res) => {
    try {
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

    } catch (err) {
      next(err)
    }
  },


  verifyotp: (req, res) => {
    try {
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

    } catch (err) {
      next(err)
    }
  },


  //***************************************** END SIGNUP USER ****************************************/


  //signin
  login: async (req, res) => {
    try {
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
      res.redirect('/');

    } catch (err) {
      next(err)
    }
  },


  // All Product
  allproductpage: async (req, res) => {
    try {
      if (req.session.userLogin) {
        id = req.params.id

        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 })
        console.log(products)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render('user/allProducts', { login: true, user: req.session.user, products, brandproducts, brand, fuel, type })
      }
      else {
        id = req.params.id

        const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 })
        console.log(products)
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render('user/allProducts', { login: false, products, brandproducts, brand, fuel, type })

      }

    } catch (err) {
      next(err)
    }

  },


  // Category product page
  categoryproductpage: async (req, res) => {
    try {
      if (req.session.userLogin) {

        id = req.params.id
        // const name = await ProductModel.findById({_id: id}).populate('brand')
        const name = req.params.category
        console.log(name);
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ sold: 'Notsold', $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 })
        console.log(brandproducts);
        res.render('user/categoryProducts', { login: true, user: req.session.user, name, brandproducts, brand, type, fuel })
      }
      else {
        id = req.params.id
        const name = req.params.category
        console.log(name);
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ sold: 'Notsold', $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 })
        console.log(brandproducts);
        res.render('user/categoryProducts', { login: false, name, brandproducts, brand, type, fuel })

      }

    } catch (err) {
      next(err)
    }
  },


  // Single Product
  singleProductpage: async (req, res) => {
    try {
      if(req.session.userLogin) {

        const product = await ProductModel.findById({ _id: req.params.id }).populate('type').populate('brand').populate('fuelType')
        console.log(product);
        id = req.params.id
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
        
        res.render('user/singleProduct', { login: true, user: req.session.user, product, brandproducts, brand, type, fuel })
      }else {
        const product = await ProductModel.findById({ _id: req.params.id }).populate('type').populate('brand').populate('fuelType')
        console.log(product);
        id = req.params.id
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
        
        res.render('user/singleProduct', { login: false, user: req.session.user, product, brandproducts, brand, type, fuel })

      }

    } catch (err) {
      next(err)
    }
  },


  // Add to Wishlist
  addtowishlist: async (req, res) => {
    try {
      if (req.session.userLogin) {

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

      }
      else {
        res.redirect('/signin')
      }

    } catch (err) {
      next(err)
    }

  },


  // Wishlist Page
  wishlist: async (req, res) => {
    try {
      id = req.params.id
      let userId = req.session.userId;
      console.log(userId)
      // let list = await Wishlist.findOne({ userId: userId }).populate('productIds').populate('productIds.$.brand')
      let list = await Wishlist.aggregate([
        {
          '$match': {
            userId: mongoose.Types.ObjectId(userId)
          }
        },
        {
          '$unwind': {
            'path': '$productIds'
          }
        }, {
          '$lookup': {
            'from': 'productdatas',
            'localField': 'productIds',
            'foreignField': '_id',
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$lookup': {
            'from': 'branddatas',
            'localField': 'result.brand',
            'foreignField': '_id',
            'as': 'result.brand'
          }
        }, {
          '$unwind': {
            'path': '$result.brand'
          }
        }, {
          '$lookup': {
            'from': 'vehicledatas',
            'localField': 'result.type',
            'foreignField': '_id',
            'as': 'result.type'
          }
        }, {
          '$unwind': {
            'path': '$result.type'
          }
        }, {
          '$lookup': {
            'from': 'fueldatas',
            'localField': 'result.fuelType',
            'foreignField': '_id',
            'as': 'result.fuelType'
          }
        }, {
          '$unwind': {
            'path': '$result.fuelType'
          }
        }, {
          '$project': {
            'result': 1
          }
        }
      ])
      console.log(list)
      if (list) {
        // let wish = list.productIds
        if (req.session.userLogin) {
          const brand = await BrandModel.find()
          const fuel = await FuelModel.find()
          const type = await TypeModel.find()
          const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

          res.render("user/wishlist", { login: true, user: req.session.user, list, brandproducts, index: 1, brand, fuel, type })
        } else {
          res.redirect('/signin')
        }
      }

    } catch (err) {
      next(err)
    }

  },


  removeFromWishlist: async (req, res) => {
    try {
      if (req.session.userLogin) {

        let productId = req.params.id
        let userId = req.session.userId;
        await Wishlist.findOneAndUpdate({ userId }, { $pull: { productIds: productId } })
          .then(() => {
            res.redirect('/wishlist')
          })
      } else {
        res.redirect('/signin')
      }

    } catch (err) {
      next(err)
    }

  },


  // Car Blocking Page
  carblockingpage: async (req, res) => {
    try {

      if (req.session.userLogin) {

        const id = req.params.id;
        const product = await ProductModel.findOne({ _id: id })
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render('user/carblockingpage', { login: true, user: req.session.user, brandproducts, brand, type, fuel, product, id })
      }
      else {
        res.redirect('/signin')
      }
    } catch (err) {
      next(err)
    }

  },


  // Block Car 
  blockCar: async (req, res) => {
    try {
      if (req.session.userLogin) {

        const id = req.params.id
        await UserModel.findOneAndUpdate({ _id: req.session.userId }, { $addToSet: { BookedVehicles: id } })
        await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
          .then(() => {
            res.redirect('/allproductpage')
          })
      } else {
        res.redirect('/signin')

      }

    } catch (err) {
      next(err)
    }
  },


  // Order Payment
  order: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const id = req.body.proId
        console.log(id);
        const amount = await ProductModel.findOne({ _id: id })

        var instance = new Razorpay({
          key_id: 'rzp_test_ySng6ZWmNYwGd1',
          key_secret: 'PNUZlKIJV7NhpD7UhzEXtRkB',
        });

        instance.orders.create(
          {
            amount: (amount.advance) * 100,
            currency: "INR",
            receipt: "car1",
          },
          function (err, order) {
            if (err) {
              console.log('Error');
              console.log(err);
            } else {
              console.log("New Order: ", order);
              let response = {
                id, order
              }
              res.status(200).send(response);

            }
          }

        );
      }

    } catch (err) {
      next(err)
    }

  },


  // Verify Payment
  verifyorder: async (req, res) => {
    try {
      const details = req.body
      console.log(req.body, "dt");
      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', "PNUZlKIJV7NhpD7UhzEXtRkB")
      hmac.update(details['payment[razorpay_order_id]'] + "|" + details['payment[razorpay_payment_id]'], "PNUZlKIJV7NhpD7UhzEXtRkB");
      hmac = hmac.digest('hex')

      const orderId = details['order[order][receipt]']
      console.log("Showing orderID");
      console.log(orderId);
      // console.log(hmac,details['payment[razorpay_signature]'],"check match")
      let response = { "status": false }
      if (details['payment[razorpay_signature]'] == hmac) {
        console.log('order Successfull');
        response = { "status": true }
      } else {
        response = { "status": false }
        console.log('payment failed');
      }
      res.send(response);

    } catch (err) {
      next(err)
    }
  },


  // Block Car after payment
  ordersuccess: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const userId = req.session.userId
        const id = req.params.id

        const blocked = OrderModel({
          userId: userId,
          product: id
        })

        console.log(Date.now());
        await UserModel.findOneAndUpdate({ _id: userId }, { $addToSet: { BookedVehicles: id } })
        await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked", blockedDate: Date.now() } })

        await blocked.save()
          .then(() => {
            res.redirect('/')
          }).catch((err) => {
            console.log(err.message);
            res.redirect("/");
          });

      }

    } catch (err) {
      next(err)
    }

  },


  // BlockedCarModel: async (req,res) => {
  //   console.log("reached here");
  //   const userId = req.session.userId;
  //   const productId = req.params.id;
  //   const blockedcar = BlockedCarModel({userId , productId})
  //   await blockedcar.save()
  //   .then(()=>{
  //     console.log("reached next>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //     res.redirect('/allproductpage');
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   })
  // } ,


  blockedcarspage: async (req, res) => {
    try {
      if (req.session.userLogin) {

        const id = req.params.id
        const userId = req.session.userId
        const cars = await UserModel.aggregate([
          {
            '$match': {
              _id: mongoose.Types.ObjectId(userId)
            }
          },
          {
            '$unwind': {
              'path': '$BookedVehicles'
            }
          }, {
            '$lookup': {
              'from': 'productdatas',
              'localField': 'BookedVehicles',
              'foreignField': '_id',
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$lookup': {
              'from': 'branddatas',
              'localField': 'result.brand',
              'foreignField': '_id',
              'as': 'result.brand'
            }
          }, {
            '$unwind': {
              'path': '$result.brand'
            }
          }, {
            '$lookup': {
              'from': 'vehicledatas',
              'localField': 'result.type',
              'foreignField': '_id',
              'as': 'result.type'
            }
          }, {
            '$unwind': {
              'path': '$result.type'
            }
          }, {
            '$lookup': {
              'from': 'fueldatas',
              'localField': 'result.fuelType',
              'foreignField': '_id',
              'as': 'result.fuelType'
            }
          }, {
            '$unwind': {
              'path': '$result.fuelType'
            }
          }, {
            '$project': {
              'result': 1
            }
          }
        ])
        console.log(cars, '1234567');

        if (cars) {
          // let wish = list.productIds
          const brand = await BrandModel.find()
          const fuel = await FuelModel.find()
          const type = await TypeModel.find()
          const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

          res.render('user/blockedcars', { login: true, user: req.session.user, brandproducts, cars, brand, fuel, type, index: 1 })
        } else {
          res.redirect('/signin')
        }
      }

    } catch (err) {
      next(err)
    }


  },





  profile: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const id = req.session.userId;
        const userdetails = await UserModel.findById({ _id: id })
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render('user/profile', { login: true, user: req.session.user, userdetails, brandproducts, brand, fuel, type })
      } else {
        res.redirect('/signin')

      }

    } catch (err) {
      next(err)
    }
  },

  editprofilepage: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const id = req.params.id
        let profile = await UserModel.findById({ _id: id })
        const brand = await BrandModel.find()
        const fuel = await FuelModel.find()
        const type = await TypeModel.find()
        const brandproducts = await ProductModel.find({ $or: [{ type: id }, { brand: id }, { fuelType: id }] }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')

        res.render('user/editprofile', { login: true, user: req.session.user, brandproducts, profile, brand, fuel, type })
      } else {
        res.redirect('/signin')

      }

    } catch (err) {
      next(err)
    }
  },

  updateProfile: async (req, res) => {
    try {
      if (req.session.userLogin) {
        const { fullName, userName, email, phone } = req.body;

        let details = await UserModel.findOneAndUpdate({ _id: req.params.id }, { $set: { fullName, userName, email, phone } });
        await details.save()
          .then(() => {
            res.redirect('/profile')
          })
      }
      else {
        res.redirect('/signin')
      }

    } catch (err) {
      next(err)
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
    try {
      req.session.loggedOut = true;
      req.session.destroy()
      res.redirect('/')
    } catch (err) {
      next(err)
    }
  }

};
