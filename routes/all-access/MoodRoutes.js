const express = require('express');
const router = express.Router();
const MoodController = require('../../controllers/all-access/MoodController');

router.post('/add', MoodController.create);
router.post('/get', MoodController.index);

module.exports = router;
