var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const MentorController = require('../../controllers/all-access/MentorController');


router.get('/all', MentorController.allMentor)
router.get('/all/free', MentorController.allMentorFree)
router.get('/all/paid', MentorController.allMentorPaid)
router.get('/detail/:idMentor', MentorController.detailMentor)
router.get('/schedule/time/:idSchedule', MentorController.getTimeSchedule)
router.post('/book', MentorController.createbook)
router.get('/book/free', MentorController.getbook)