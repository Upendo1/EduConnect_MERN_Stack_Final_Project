const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');
router.post('/', auth, ctrl.sendMessage);
router.get('/:userId', auth, ctrl.getConversation);
module.exports = router;
