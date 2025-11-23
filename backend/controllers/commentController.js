const Comment = require('../models/Comment');
exports.createComment = async (req, res) => {
  const { postId, content } = req.body;
  const comment = new Comment({ post: postId, author: req.user._id, content });
  await comment.save();
  res.status(201).json(comment);
};
exports.listComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('author','name avatarUrl');
  res.json(comments);
};
