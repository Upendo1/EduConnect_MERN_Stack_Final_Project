const express = require('express');
const router = express.Router();
const { upload, list, getById, delete: deleteResource } = require('../controllers/resourceController');
const uploadMiddleware = require('../middleware/upload');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// List and get
router.get('/', protect, list);
router.get('/:id', protect, getById);

// Teacher/Admin upload and delete
router.post('/', protect, authorizeRoles('teacher','admin'), uploadMiddleware.single('file'), upload);
router.delete('/:id', protect, authorizeRoles('teacher','admin'), deleteResource);

module.exports = router;
