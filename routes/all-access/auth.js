var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const AuthController = require('../../controllers/all-access/AuthController');



router.get('/get', AuthController.adminPermission, function(req, res){
    res.send("Hello")
})

router.post('/user/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/token', AuthController.tokenUser)
router.post('/sendVerifyEmail', AuthController.sendVerifyEmail)
router.get('/verify-email/:token', AuthController.verifyEmail)
router.put('/update', AuthController.isVerifyPermission)