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




//logout
router.get("/adminlogout", controller.logout)



//-------------------------------------------------------------------------------------------------
// POST METHOD

router.post("/", controller.adminlogin)
router.post("/addproduct", controller.addproduct)
router.post("/adduser", controller.adduser)











module.exports = router