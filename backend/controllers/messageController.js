const Message = require('../models/Message');
exports.sendMessage = async (req, res) => {
  const { to, text } = req.body;
  const m = new Message({ from: req.user._id, to, text });
  await m.save();
  req.io && req.io.to(to).emit('message', m);
  res.status(201).json(m);
};
exports.getConversation = async (req, res) => {
  const { userId } = req.params;
  const msgs = await Message.find({ $or: [{ from: req.user._id, to: userId }, { from: userId, to: req.user._id }] }).sort({ createdAt: 1 });
  res.json(msgs);
};
