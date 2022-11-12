const express = require('express')
const router = express.Router()



const controller = require('../controllers/userController')
const userSession = require('../middleware/auth')








//-------------------------------------------------------------------------------------------------
//get 
router.get('/', controller.home)
router.get('/signin', controller.signin)
router.get('/allproductpage',controller.allproductpage)


router.get('/logout',controller.logout)


//-------------------------------------------------------------------------------------------------
//post
// router.post('/signup', controller.signup)
router.post('/', controller.login)

router.post('/otp',controller.otp)
router.post('/resendotp',controller.resendotp)
router.post('/verifyotp',controller.verifyotp)





module.exports = router