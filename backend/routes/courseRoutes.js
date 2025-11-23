const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
router.get('/', ctrl.listCourses);
router.post('/', auth, ctrl.createCourse);
module.exports = router;
