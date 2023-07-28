var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const MentorProfileController = require('../../controllers/mentor/MentorProfileController');


router.get('/get', MentorProfileController.getProfile)
router.get('/get/schedule', MentorProfileController.getProfile)
router.get('/get/book/now', MentorProfileController.getbookAll)
router.get('/get/book/all', MentorProfileController.getbookAll)
router.get('/get/book/history', MentorProfileController.getbookAll)