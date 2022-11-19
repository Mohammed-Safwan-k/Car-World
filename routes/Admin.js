const express = require('express')
const router = express.Router()


const controller = require('../controllers/adminController')

//-------------------------------------------------------------------------------------------------
// GET METHOD



router.get("/", controller.admin)
router.get("/adminhome", controller.home)

//  GET All page
router.get("/alluser", controller.alluser)
router.get("/allproduct", controller.viewproduct)
router.get('/allBanner',controller.allBanner)

// GET ADD page
router.get("/addproductpage", controller.addproductpage)
router.get("/adduserpage", controller.adduserpage)
router.get("/editproductpage/:id", controller.editproductpage)

router.get('/brandpage',controller.brandpage)
router.get('/vehicletype',controller.vehicletypepage)
router.get('/fueltype',controller.fueltypepage)

router.get("/addBannerPage", controller.addBannerPage)







//logout
router.get("/adminlogout", controller.logout)



//-------------------------------------------------------------------------------------------------
// POST METHOD

router.post("/", controller.adminlogin)
router.post("/addproduct", controller.addproduct)
router.post("/deleteproduct/:id",controller.deleteproduct)
router.post("/updateProduct/:id",controller.updateProduct)
router.post("/unblockCar/:id",controller.unblockCar)
router.post("/blockCar/:id",controller.blockCar)

router.post("/adduser", controller.adduser)
router.post("/unblockUser/:id",controller.unblockUser)
router.post("/blockUser/:id",controller.blockUser)

router.post("/addBrand",controller.addBrand)
router.post("/deletebrand/:id",controller.deletebrand)

router.post("/addvehicletype",controller.addvehicletype)
router.post("/deletevehicletype/:id",controller.deletevehicletype)

router.post("/addfueltype",controller.addfuel)
router.post("/deletefueltype/:id",controller.deletefueltype)

router.post("/addBanner",controller.addBanner)















module.exports = router