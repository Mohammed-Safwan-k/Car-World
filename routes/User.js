const express = require('express')
const router = express.Router()



const controller = require('../controllers/userController')
const userSession = require('../middleware/auth')








//-------------------------------------------------------------------------------------------------
//get 
router.get('/',controller.home)
router.get('/signin', controller.signin)
router.get('/allproductpage',controller.allproductpage)
router.get('/singleProduct/:id',controller.singleProductpage)
router.get('/wishlist',controller.wishlist)
router.get('/carblockingpage/:id',controller.carblockingpage)
router.get('/profile',controller.profile)
router.get('/editprofilepage/:id',controller.editprofilepage)

router.get('/categoryProductspage/:id/:category',controller.categoryproductpage)
router.get('/blockedcarspage',controller.blockedcarspage)


router.get('/demo',controller.demo)


router.get('/logout',controller.logout)



//-------------------------------------------------------------------------------------------------
//post
// router.post('/signup', controller.signup)
router.post('/', controller.login)

router.post('/otp',controller.otp)
router.post('/resendotp',controller.resendotp)
router.post('/verifyotp',controller.verifyotp)

router.post('/addToWishlist/:productId',controller.addtowishlist)
router.post('/removeFromWishlist/:id', controller.removeFromWishlist)
router.post('/blockCar/:id',controller.blockCar)

router.post('/updateProfile/:id',controller.updateProfile)




module.exports = router