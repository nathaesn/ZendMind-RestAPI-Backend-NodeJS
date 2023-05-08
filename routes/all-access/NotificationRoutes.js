const express = require('express');
const router = express.Router();

const NotificationController = require('../../controllers/all-access/NotificationController');

router.get('/',NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getNotificationById);
router.post('/', NotificationController.createNotification);
router.put('/:id', NotificationController.updateNotification);
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;
