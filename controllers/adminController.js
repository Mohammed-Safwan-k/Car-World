const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/vehicletypeModel")
const FuelModel = require('../models/fueltypeModel')

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
    addproductpage: async (req, res) => {
        if (req.session.adminLogin) {
            const type = await TypeModel.find()
            const brand = await BrandModel.find()
            const fuel = await FuelModel.find()

            res.render('admin/addproduct', { type, brand, fuel })

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

    // Block and Unblock Users
    blockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({_id:id},{$set:{status:"Blocked"}})
        .then(() => {
            res.redirect('/admin/alluser')
        })
    },



    unblockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({_id:id},{$set:{status:"Unblocked"}})
        .then(() => {
            res.redirect('/admin/alluser')
        })
    },

    //-------------------------------------------------------------------------
    // PRODUCTS


    //add products
    addproduct: async (req, res) => {
        // const newProduct = ProductModel(req.body);
        // console.log(req.body)
        // try {
        //     await newProduct.save()
        //     res.render("admin/adminhome")
        // } catch {
        //     console.log(err, 'error')
        //     res.render("admin/adminhome")
        // }
        // newProduct
        //     .save()
        //     .then(() => {
        //         res.render("admin/adminhome")
        //     })
        //     .catch((err) => {
        //         console.log(err, 'error')
        //         res.render("admin/adminhome")
        //     })



        const { type, brand, fuelType, productName, discription, price } = req.body;

        const image = req.file;
        console.log(image);

        const newProduct = ProductModel({
            type,
            brand,
            fuelType,
            productName,
            discription,
            price,
            image: image.filename,
        });
        console.log(newProduct)

        await newProduct
            .save()
            .then(() => {
                res.redirect("/admin/allproduct");
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/addproductpage");
            });
    },

    //view all products
    viewproduct: async (req, res) => {
        const products = await ProductModel.find({}).populate('type','typeName').populate('brand','brand').populate('fuelType')
        console.log(products)
        res.render('admin/viewproduct', { products, index: 1 })

    },


    //------------------------------------------------------------------------------------------------------------------
    // BRAND
    brandpage: async (req, res) => {
        const brand = await BrandModel.find({});
        res.render('admin/brand', { brand })
    },
    // NEW BRAND
    addBrand: (req, res) => {
        const brand = req.body.brand;
        const newBrand = BrandModel({ brand });
        newBrand.save().then(res.redirect('/admin/brandpage'))
    },
    // DELETE BRAND
    deletebrand: async (req, res) => {
        let id = req.params.id;
        // console.log("delete")
        await BrandModel.findByIdAndDelete({ _id: id });
        res.redirect("/admin/brandpage")
    },







    // VEHICLE TYPE
    vehicletypepage: async (req, res) => {
        const typeName = await TypeModel.find({});
        res.render('admin/vehicleType', { typeName })
    },
    // NEW VEHICLE TYPE
    addvehicletype: (req, res) => {
        const typeName = req.body.typeName;
        const newVehicleType = TypeModel({ typeName });
        newVehicleType.save().then(res.redirect('/admin/vehicletype'))
    },
    // DELETE VEHICLE
    deletevehicletype: async (req, res) => {
        let id = req.params.id;
        // console.log("delete")
        await TypeModel.findByIdAndDelete({ _id: id });
        res.redirect("/admin/vehicletype")
    },




    // FUEL TYPE
    fueltypepage: async (req, res) => {
        const fuelType = await FuelModel.find({});
        res.render('admin/fuelType', { fuelType })
    },
    // NEW FUEL
    addfuel: (req, res) => {
        const fuelType = req.body.fuelType;
        const newfuel = FuelModel({ fuelType });
        newfuel.save().then(res.redirect('/admin/fueltypepage'))
    },
    // DELETE FUEL TYPE
    deletefueltype: async (req, res) => {
        let id = req.params.id;
        // console.log("delete")
        await FuelModel.findByIdAndDelete({ _id: id });
        res.redirect("/admin/fueltypepage")
    },






    //------------------------------------------------------------------------------------------------------------------





    //-------------------------------------------------------------------------
    // LOG OUT



    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy()
        res.redirect('/admin')

    }

};