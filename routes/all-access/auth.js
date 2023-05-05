var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const AuthController = require('../../controllers/all-access/AuthController');



router.get('/get', function(req, res){
    res.send("Hello")
})

router.post('/user/register', AuthController.register)
router.post('/login', AuthController.login)