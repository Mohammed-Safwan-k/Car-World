const express = require('express')
const router = express.Router()


const controller = require('../controllers/adminController')
const adminSession = require('../middleware/auth')


//-------------------------------------------------------------------------------------------------
// GET METHOD



router.get("/", controller.admin)
router.get("/adminhome", adminSession.adminSession, controller.home)

//  GET All page
router.get("/alluser", adminSession.adminSession, controller.alluser)
router.get("/allproduct", adminSession.adminSession, controller.viewproduct)
router.get('/allBanner', adminSession.adminSession, controller.allBanner)

// GET ADD page
router.get("/addproductpage", adminSession.adminSession, controller.addproductpage)
router.get("/adduserpage", adminSession.adminSession, controller.adduserpage)
router.get("/editproductpage/:id", adminSession.adminSession, controller.editproductpage)
router.get("/soldcarpage", adminSession.adminSession, controller.soldcarpage)
router.get("/blockedcarpage", adminSession.adminSession, controller.blockedcarpage)

router.get('/brandpage', adminSession.adminSession, controller.brandpage)
router.get('/vehicletype', adminSession.adminSession, controller.vehicletypepage)
router.get('/fueltype',  adminSession.adminSession, controller.fueltypepage)

router.get("/addBannerPage", adminSession.adminSession, controller.addBannerPage)







//logout
router.get("/adminlogout", controller.logout)



//-------------------------------------------------------------------------------------------------
// POST METHOD

router.post("/", controller.adminlogin)
router.post("/addproduct", adminSession.adminSession, controller.addproduct)
router.post("/deleteproduct/:id", adminSession.adminSession, controller.deleteproduct)
router.post("/updateProduct/:id", adminSession.adminSession, controller.updateProduct)
router.post("/unblockCar/:id", adminSession.adminSession, controller.unblockCar)
router.post("/blockCar/:id", adminSession.adminSession, controller.blockCar)
router.post("/soldCarp/:id", adminSession.adminSession, controller.soldCarp)
router.post("/soldCarb/:id", adminSession.adminSession, controller.soldCarb)
router.post("/notsoldCar/:id", adminSession.adminSession, controller.notsoldCar)

router.post("/adduser", adminSession.adminSession, controller.adduser)
router.post("/unblockUser/:id", adminSession.adminSession, controller.unblockUser)
router.post("/blockUser/:id", adminSession.adminSession, controller.blockUser)

router.post("/addBrand", adminSession.adminSession, controller.addBrand)
router.post("/deletebrand/:id", adminSession.adminSession, controller.deletebrand)

router.post("/addvehicletype", adminSession.adminSession, controller.addvehicletype)
router.post("/deletevehicletype/:id", adminSession.adminSession, controller.deletevehicletype)

router.post("/addfueltype", adminSession.adminSession, controller.addfuel)
router.post("/deletefueltype/:id", adminSession.adminSession, controller.deletefueltype)

router.post("/addBanner", adminSession.adminSession, controller.addBanner)
router.post("/deletebanner/:id", adminSession.adminSession, controller.deletebanner)















module.exports = router