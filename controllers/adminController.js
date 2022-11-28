const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const BrandModel = require("../models/brandModel");
const TypeModel = require("../models/vehicletypeModel")
const FuelModel = require('../models/fueltypeModel')
const BannerModel = require("../models/bannerModel")

const bcrypt = require("bcrypt");
const OrderModel = require("../models/orderModel");


module.exports = {

    //-------------------------------------------------------------------------------------------------
    // RENDING PAGES



    //admin home page
    home: async (req, res) => {
        try {
            const users = await UserModel.find().countDocuments()
            const products = await ProductModel.find().countDocuments()
            const sold = await ProductModel.find({ sold: 'Sold' }).countDocuments()
            const blocked = await ProductModel.find({ status: 'Blocked' }).countDocuments()
            const Brand = await BrandModel.find().countDocuments()
            const Type = await TypeModel.find().countDocuments()
            const Fuel = await FuelModel.find().countDocuments()
            const Banner = await BannerModel.find().countDocuments()
            res.render('admin/home', { admin: req.session.admin, users, products, sold, blocked, Brand, Type, Fuel, Banner })
        } catch (err) {
            next(err)
        }

    },

    //login page
    admin: (req, res) => {
        try {
            if (!req.session.adminLogin) {
                res.render('admin/login')
            } else {
                res.redirect('/admin/adminhome')
            }
        } catch (err) {
            next(err)
        }

    },



    //-------------------------------------------------------------------------------------------------

    //login
    adminlogin: async (req, res) => {
        try {
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
            req.session.admin = admin.userName
            res.redirect('/admin/adminhome');

        } catch (err) {
            next(err)
        }
    },



    //************************************************ User Start **************************************************************************** */

    //add user page
    adduserpage: (req, res) => {
        try {
            res.render('admin/adduser', { admin: req.session.admin })
        } catch (err) {
            next(err)
        }
    },

    //add user
    adduser: (req, res) => {
        try {
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
                            res.redirect("/admin/alluser");
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/admin/alluser")
                        })
                })
            })
        } catch (err) {
            next(err)
        }

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
        try {
            const users = await UserModel.find({})
            res.render('admin/viewuser', { users, index: 1, admin: req.session.admin })

        } catch (err) {
            next(err)
        }

    },

    // Block and Unblock Users
    blockUser: async (req, res) => {
        try {
            const id = req.params.id
            await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
                .then(() => {
                    res.redirect('/admin/alluser')
                })

        } catch (err) {
            next(err)
        }
    },

    unblockUser: async (req, res) => {
        try {
            const id = req.params.id
            await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
                .then(() => {
                    res.redirect('/admin/alluser')
                })

        } catch (err) {
            next(err)
        }
    },

    //**************************************************** User End *********************************************************************************/


    //**************************************************** Product Start ***********************************************************************************/

    //add product page
    addproductpage: async (req, res) => {
        try {
            if (req.session.adminLogin) {
                const type = await TypeModel.find()
                const brand = await BrandModel.find()
                const fuel = await FuelModel.find()

                res.render('admin/addproduct', { type, brand, fuel, admin: req.session.admin })

            }

        } catch (err) {
            next(err)
        }
    },

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


        try {
            const { type, brand, fuelType, productName, discription, price, advance } = req.body;

            const image = req.files;
            image.forEach(img => { });
            console.log(image);
            const productimages = image != null ? image.map((img) => img.filename) : null
            console.log(productimages)

            const newProduct = ProductModel({
                type,
                brand,
                fuelType,
                productName,
                discription,
                price,
                advance,
                // image: image.filename,
                image: productimages
            });
            console.log(newProduct)

            await newProduct
                .save()
                .then(() => {
                    res.redirect("/admin/allproduct");
                }).catch((err) => {
                    console.log(err.message);
                    res.redirect("/admin/addproductpage");
                });

        } catch (err) {
            next(err)
        }

    },

    //view all products
    viewproduct: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalproducts = await ProductModel.find().countDocuments()
            console.log(totalproducts);
            const products = await ProductModel.find({ sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(products)
            res.render('admin/viewproduct', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        } catch (err) {
            next(err)
        }

    },

    // Delete Product
    deleteproduct: async (req, res) => {
        try {
            let id = req.params.id;
            await ProductModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/allproduct")

        } catch (err) {
            next(err)
        }
    },

    //edit product page
    editproductpage: async (req, res) => {
        try {
            if (req.session.adminLogin) {
                const id = req.params.id
                const type = await TypeModel.find()
                const brand = await BrandModel.find()
                const fuel = await FuelModel.find()
                let product = await ProductModel.findOne({ _id: id }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType')
                console.log(product)
                res.render('admin/editProduct', { product, type, brand, fuel, admin: req.session.admin })
            }

        } catch (err) {
            next(err)
        }

    },

    // Update Product
    updateProduct: async (req, res) => {
        try {
            const { type, brand, fuelType, productName, discription, price, advance } = req.body;

            if (req.file) {
                // await ProductModel.findByIdAndUpdate(
                //     { _id: req.params.id }, { $set: { image: image.filename } }
                // );
                const image = req.files;
                image.forEach(img => { });
                console.log(image);
                const productimages = image != null ? image.map((img) => img.filename) : null
                console.log(productimages)

                await ProductModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { image: productimages } })
            }
            let details = await ProductModel.findOneAndUpdate(
                { _id: req.params.id }, { $set: { type, brand, fuelType, productName, discription, price, advance } }
            );
            await details.save().then(() => {
                res.redirect('/admin/allproduct')
            })

        } catch (err) {
            next(err)
        }
    },
    //*************************************************** Product End *****************************************************************************************/
    //====================================================================================================================

    // sold car page
    soldcarpage: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalsoldproducts = await ProductModel.find({ sold: 'Sold' }).countDocuments()
            console.log(totalsoldproducts);
            const products = await ProductModel.find({ sold: 'Sold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(products)
            res.render('admin/soldcar', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalsoldproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        } catch (err) {
            next(err)
        }

    },

    //====================================================================================================================

    // Blocked car page
    blockedcarpage: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalblockedproducts = await ProductModel.find({ status: 'Blocked' }).countDocuments()
            console.log(totalblockedproducts);
            const products = await ProductModel.find({ status: 'Blocked', sold: 'Notsold' }).populate('type', 'typeName').populate('brand', 'brand').populate('fuelType').sort({ blockedDate: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(products)
            res.render('admin/blockedcars', {
                products, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalblockedproducts,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })

        } catch (err) {
            next(err)
        }

    },

    //====================================================================================================================

    // UnBlock Car
    unblockCar: async (req, res) => {
        try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        } catch (err) {
            next(err)
        }
    },

    // Block car
    blockCar: async (req, res) => {
        try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        } catch (err) {
            next(err)
        }
    },

    //====================================================================================================================

    // Sold Car
    soldCarp: async (req, res) => {
        try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Sold" } })
                .then(() => {
                    res.redirect('/admin/allproduct')
                })

        } catch (err) {
            next(err)
        }
    },

    // Sold Car
    soldCarb: async (req, res) => {
        try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Sold" } })
                .then(() => {
                    res.redirect('/admin/blockedcarpage')
                })

        } catch (err) {
            next(err)
        }
    },

    // Not Sold Car
    notsoldCar: async (req, res) => {
        try {
            const id = req.params.id
            await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { sold: "Notsold" } })
                .then(() => {
                    res.redirect('/admin/soldcarpage')
                })

        } catch (err) {
            next(err)
        }
    },


    //====================================================================================================================

    // BRAND
    brandpage: async (req, res) => {
        try {
            const brand = await BrandModel.find({});
            res.render('admin/brand', { brand, admin: req.session.admin })

        } catch (err) {
            next(err)
        }
    },
    // NEW BRAND
    addBrand: (req, res) => {
        try {
            const brand = req.body.brand;
            const newBrand = BrandModel({ brand });
            newBrand.save().then(res.redirect('/admin/brandpage'))

        } catch (err) {
            next(err)
        }
    },
    // DELETE BRAND
    deletebrand: async (req, res) => {
        try {
            let id = req.params.id;
            // console.log("delete")
            await BrandModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/brandpage")

        } catch (err) {
            next(err)
        }
    },

    //====================================================================================================================

    // VEHICLE TYPE
    vehicletypepage: async (req, res) => {
        try {
            const typeName = await TypeModel.find({});
            res.render('admin/vehicleType', { typeName, admin: req.session.admin })

        } catch (err) {
            next(err)
        }
    },
    // NEW VEHICLE TYPE
    addvehicletype: (req, res) => {
        try {
            const typeName = req.body.typeName;
            const newVehicleType = TypeModel({ typeName });
            newVehicleType.save().then(res.redirect('/admin/vehicletype'))

        } catch (err) {
            next(err)
        }
    },
    // DELETE VEHICLE
    deletevehicletype: async (req, res) => {
        try {
            let id = req.params.id;
            // console.log("delete")
            await TypeModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/vehicletype")

        } catch (err) {
            next(err)
        }
    },

    //====================================================================================================================

    // FUEL TYPE
    fueltypepage: async (req, res) => {
        try {
            const fuelType = await FuelModel.find({});
            res.render('admin/fuelType', { fuelType, admin: req.session.admin })

        } catch (err) {
            next(err)
        }
    },
    // NEW FUEL
    addfuel: (req, res) => {
        try {
            const fuelType = req.body.fuelType;
            const newfuel = FuelModel({ fuelType });
            newfuel.save().then(res.redirect('/admin/fueltype'))

        } catch (err) {
            next(err)
        }
    },
    // DELETE FUEL TYPE
    deletefueltype: async (req, res) => {
        try {
            let id = req.params.id;
            // console.log("delete")
            await FuelModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/fueltype")

        } catch (err) {
            next(err)
        }
    },

    //====================================================================================================================


    //====================================================================================================================

    // Order Page / Payment Page
    orders: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const items_per_page = 5;
            const totalorders = await OrderModel.find().countDocuments()
            console.log(totalorders);

            const orders = await OrderModel.find().populate('userId').populate({ path: 'product', populate: { path: 'fuelType' } }).populate({ path: 'product', populate: { path: 'brand' } }).populate('product.type').populate('product.brand').populate('product.fuelType').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
            console.log(orders)
            res.render('admin/orders', {
                orders, index: 1, admin: req.session.admin, page,
                hasNextPage: items_per_page * page < totalorders,
                hasPreviousPage: page > 1,
                PreviousPage: page - 1,
            })
        } catch (error) {
            next(error);
        }


    },
    //====================================================================================================================

    //******************************************* BANNER START ***********************************************************/


    allBanner: async (req, res) => {
        try {
            const banners = await BannerModel.find({})
            console.log(banners)
            res.render('admin/viewBanner', { banners, index: 1, admin: req.session.admin })

        } catch (err) {
            next(err)
        }
    },

    addBannerPage: async (req, res) => {
        try {
            res.render('admin/addBanner', { admin: req.session.admin })

        } catch (err) {
            next(err)
        }
    },

    addBanner: async (req, res) => {
        try {
            const { bannerName, discription } = req.body

            const image = req.files;
            image.forEach(img => { });
            console.log(image);
            const bannerimages = image != null ? image.map((img) => img.filename) : null

            const newBanner = BannerModel({
                bannerName,
                discription,
                image: bannerimages,
            });
            console.log(newBanner)

            await newBanner
                .save()
                .then(() => {
                    res.redirect("/admin/allBanner");
                })
                .catch((err) => {
                    console.log(err.message);
                    res.redirect("/admin/addBannerPage");
                });

        } catch (err) {
            next(err)
        }

    },

    deletebanner: async (req, res) => {
        try {
            let id = req.params.id;
            await BannerModel.findByIdAndDelete({ _id: id });
            res.redirect("/admin/allBanner")

        } catch (err) {
            next(err)
        }

    },

    //******************************************* BANNER END ***********************************************************/

    //-------------------------------------------------------------------------
    // LOG OUT



    logout: (req, res) => {
        try {
            req.session.loggedOut = true;
            req.session.destroy()
            res.redirect('/admin')

        } catch (err) {
            next(err)
        }

    }

};