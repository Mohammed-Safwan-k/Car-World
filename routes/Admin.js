const express = require('express')
const router = express.Router()


const controller = require('../controllers/adminController')

//-------------------------------------------------------------------------------------------------
// GET METHOD



router.get("/", controller.admin)
router.get("/adminhome", controller.home)

router.get("/alluser", controller.alluser)
router.get("/allproduct", controller.viewproduct)

//get add product page
router.get("/addproductpage", controller.addproductpage)
router.get("/adduserpage", controller.adduserpage)

router.get('/brandpage',controller.brandpage)
router.get('/vehicletype',controller.vehicletypepage)
router.get('/fueltype',controller.fueltypepage)




//logout
router.get("/adminlogout", controller.logout)



//-------------------------------------------------------------------------------------------------
// POST METHOD

router.post("/", controller.adminlogin)
router.post("/addproduct", controller.addproduct)
router.post("/deleteproduct/:id",controller.deleteproduct)

router.post("/adduser", controller.adduser)
router.post("/unblockUser/:id",controller.unblockUser)
router.post("/blockUser/:id",controller.blockUser)

router.post("/addBrand",controller.addBrand)
router.post("/deletebrand/:id",controller.deletebrand)

router.post("/addvehicletype",controller.addvehicletype)
router.post("/deletevehicletype/:id",controller.deletevehicletype)

router.post("/addfueltype",controller.addfuel)
router.post("/deletefueltype/:id",controller.deletefueltype)













module.exports = router