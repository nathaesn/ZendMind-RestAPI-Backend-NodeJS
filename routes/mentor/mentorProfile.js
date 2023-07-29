var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const MentorProfileController = require('../../controllers/mentor/MentorProfileController');


router.get('/get', MentorProfileController.getProfile)
router.get('/get/schedule', MentorProfileController.getSchedule)
router.get('/get/book/today', MentorProfileController.getbookToday)
router.get('/get/book/all', MentorProfileController.getbookAll)
router.get('/get/book/history', MentorProfileController.getbookHistory)
router.put('/set/fee', MentorProfileController.setfee)
router.post('/set/schedule', MentorProfileController.addDateSch)
router.post('/set/schedule/time', MentorProfileController.addTimeSch)
router.get('/set/schedule/time/delete/:id_time', MentorProfileController.deleteTimesch)