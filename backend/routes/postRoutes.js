const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const upload = require('../utils/multer');
router.get('/', ctrl.listPosts);
router.get('/:id', ctrl.getPost);
router.post('/', auth, upload.array('files', 10), ctrl.createPost);
module.exports = router;
