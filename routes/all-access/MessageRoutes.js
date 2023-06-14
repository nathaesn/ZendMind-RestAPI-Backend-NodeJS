// File: messages.js

const express = require('express');
const router = express.Router();
module.exports = router
const { body, validationResult } = require('express-validator');
const messagesController = require('../../controllers/all-access/MessageController');

router.get('/', messagesController.getAll);
router.post('/', messagesController.create);
router.get('/ai', messagesController.createAi);

module.exports = router;
