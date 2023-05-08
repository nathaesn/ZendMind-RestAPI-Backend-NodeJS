const models = require('../../models');
const Notification = models.Notification

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll(
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNotification = async (req, res) => {
  const { title, message, isRead } = req.body;
  const newNotification = new Notification({
    title,
    message,
    isRead,
  });
  try {
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );
    res.json(deletedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
