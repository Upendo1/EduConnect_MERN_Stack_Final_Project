const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');
router.get('/', auth, ctrl.listNotifications);
router.post('/:id/read', auth, ctrl.markRead);
module.exports = router;
