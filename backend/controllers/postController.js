const Post = require('../models/Post');
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const attachments = req.files ? req.files.map(f => f.location || f.path) : [];
  const post = new Post({ title, content, author: req.user._id, attachments });
  await post.save();
  req.io && req.io.emit('new_post', post);
  res.status(201).json(post);
};
exports.listPosts = async (req, res) => {
  const posts = await Post.find().populate('author','name avatarUrl').sort({createdAt:-1});
  res.json(posts);
};
exports.getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author','name avatarUrl');
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
};
