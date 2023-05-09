const express = require('express');
const router = express.Router();
const MoodController = require('../../controllers/all-access/MoodController');

router.post('/mood', MoodController.create);
router.get('/mood', MoodController.index);

module.exports = router;
