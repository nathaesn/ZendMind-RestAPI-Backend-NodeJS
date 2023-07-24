var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const MentorProfileController = require('../../controllers/mentor/MentorProfileController');


router.get('/get', MentorProfileController.getProfile)