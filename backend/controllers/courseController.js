const Course = require('../models/Course');
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  const c = new Course({ title, description, instructor: req.user._id });
  await c.save();
  res.status(201).json(c);
};
exports.listCourses = async (req, res) => {
  const courses = await Course.find().populate('instructor','name avatarUrl');
  res.json(courses);
};
