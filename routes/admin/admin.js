var express = require('express')
const router = express.Router()
module.exports = router
const { body, validationResult } = require('express-validator');
const Controller = require('../../controllers/admin/AdminController');

router.get('/dashboard', Controller.dashboard)
router.get('/app/:status', Controller.app)
router.post('/mentor', Controller.addMentor)
router.post('/article', Controller.addArticle)
router.get('/gethistory', Controller.gethistory)