const Notification = require('../models/Notification');
exports.listNotifications = async (req, res) => {
  const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
};
exports.markRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ ok: true });
};
