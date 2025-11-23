const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const uploadController = require('../controllers/uploadController');
router.post('/', upload.array('files', 10), (req, res) => uploadController.uploadFiles(req, res));
module.exports = router;
