const express = require('express')
const router = express.Router()


const controller = require('../controllers/userController')

//-------------------------------------------------------------------------------------------------
//get 
router.get('/', controller.home)
router.get('/signin', controller.signin)


router.get('/logout',controller.logout)


//-------------------------------------------------------------------------------------------------
//post
router.post('/signup', controller.signup)
router.post('/', controller.login)





module.exports = router