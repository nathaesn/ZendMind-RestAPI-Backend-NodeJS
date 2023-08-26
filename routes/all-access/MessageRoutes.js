// File: messages.js

const express = require('express');
const router = express.Router();
module.exports = router
const { body, validationResult } = require('express-validator');
const messagesController = require('../../controllers/all-access/MessageController');

// router.get('/listroom', messagesController.getlistroom);
router.post('/', messagesController.create);
router.get('/chat/:roomID', messagesController.getAll);
router.get('/listroom', messagesController.getListRoom);
router.get('/ai', messagesController.createAi);
router.get('/tez', messagesController.createAi);

module.exports = router;


