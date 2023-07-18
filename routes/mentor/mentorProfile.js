var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const AuthController = require('../../controllers/all-access/AuthController');


