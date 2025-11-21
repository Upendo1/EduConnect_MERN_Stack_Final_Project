const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/refresh', require('../controllers/authController').refresh);
router.post('/logout', require('../controllers/authController').logout);

module.exports = router;
