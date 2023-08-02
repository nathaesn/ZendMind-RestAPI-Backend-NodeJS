var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const MentorController = require('../../controllers/all-access/MentorController');


router.get('/all', MentorController.allMentor)
router.get('/all/free', MentorController.allMentorFree)
router.get('/all/paid', MentorController.allMentorPaid)
router.get('/detail/:idMentor', MentorController.detailMentor)
router.get('/get/schedule/:idMentor/:monthYear', MentorController.getDateSchedule)
router.get('/schedule/time/:idSchedule', MentorController.getTimeSchedule)
router.post('/book', MentorController.createbook)
router.get('/book/free', MentorController.getbook)
router.get('/book/all', MentorController.getbookall)
router.get('/book/ongoing', MentorController.getbookOngoing)
router.get('/book/cancel/:idBook', MentorController.cancelBook)
router.get('/book/confirm/:idBook', MentorController.finishBook)
router.post('/book/reschedule', MentorController.reschedule)
router.post('/pay/test', MentorController.createPayment)