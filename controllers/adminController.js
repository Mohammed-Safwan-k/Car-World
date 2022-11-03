const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const VehicleTypeModel = require("../models/vehicletypeModel");

const bcrypt = require("bcrypt");


module.exports = {

    //-------------------------------------------------------------------------------------------------
    // RENDING PAGES



    //admin home page
    home: (req, res) => {
        if (req.session.adminLogin) {
            res.render('admin/home')
        }
    },

    //login page
    admin: (req, res) => {
        if (!req.session.adminLogin) {
            res.render('admin/login')
        } else {
            res.redirect('/admin/adminhome')
        }
    },

    //add user page
    adduserpage: (req, res) => {
        if (req.session.adminLogin) {
            res.render('admin/adduser')
        }
    },

    //add product page
    addproductpage: (req, res) => {
        if (req.session.adminLogin) {
            res.render('admin/addproduct')
        }
    },





    //-------------------------------------------------------------------------------------------------
    // REDIRECTING PAGES



    //login
    adminlogin: async (req, res) => {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.redirect('/admin');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.redirect('/admin');
        }
        req.session.adminLogin = true;
        res.redirect('/admin/adminhome');
    },



    //-------------------------------------------------------------------------
    // USER

    //add user
    adduser: (req, res) => {

        const newUser = UserModel(req.body
            //   {
            //   fullName: req.body.fullName,
            //   userName: req.body.userName,
            //   email: req.body.email,
            //   phone: req.body.phone,
            //   password: req.body.password
            // }
          );
          console.log(req.body);
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(() => {
                  res.redirect("/admin/adminhome");
                })
                .catch((err) => {
                  console.log(err);
                  res.redirect("/admin/adminhome")
                })
            })
          })

        // const newUser = UserModel(req.body);
        // try {
        //     await newUser.save()
        //     res.redirect("/admin/adminhome")
        // } catch {
        //     res.render("admin/adminhome")
        // }
        // await newUser
        //     .save()
        //     .then(() => {
        //         res.redirect("/admin/adminhome")
        //     })
        //     .catch((err) => {
        //         res.render("admin/adminhome")
        //     })
    },

    //view all user
    alluser: async (req, res) => {
        const users = await UserModel.find({})
        res.render('admin/viewuser', { users, index: 1 })

    },

    //-------------------------------------------------------------------------
    // PRODUCTS


    //add products
    addproduct: async (req, res) => {
        const newProduct = productModel(req.body);
        console.log(req.body)
        try {
            await newProduct.save()
            res.render("admin/adminhome")
        } catch {
            console.log(err, 'error')
            res.render("admin/adminhome")
        }
        // newProduct
        //     .save()
        //     .then(() => {
        //         res.render("admin/adminhome")
        //     })
        //     .catch((err) => {
        //         console.log(err, 'error')
        //         res.render("admin/adminhome")
        //     })
    },

    //view all products
    viewproduct: async (req, res) => {
        const products = await ProductModel.find({})
        res.render('admin/viewproduct', { products, index: 1 })

    },











    //-------------------------------------------------------------------------
    // LOG OUT



    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy()
        res.redirect('/admin')

    }

};