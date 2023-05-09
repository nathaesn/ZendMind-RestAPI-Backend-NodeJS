// File: messages.js

const express = require('express');
const router = express.Router();

const messagesController = require('../../controllers/all-access/MessageController');

router.get('/', messagesController.getAll);
router.post('/', messagesController.create);

module.exports = router;
