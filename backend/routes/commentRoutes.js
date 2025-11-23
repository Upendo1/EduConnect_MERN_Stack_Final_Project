const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');
router.get('/:postId', ctrl.listComments);
router.post('/', auth, ctrl.createComment);
module.exports = router;
