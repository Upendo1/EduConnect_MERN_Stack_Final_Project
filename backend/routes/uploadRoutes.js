const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const uploadController = require('../controllers/uploadController');
viewResourceFile
router.get('/:id', (req, res) => uploadController.viewResourceFile(req, res));
// router.get('/', upload.array('files', 10), (req, res) => uploadController.uploadFiles(req, res));

router.post('/', upload.array('files', 10), (req, res) => uploadController.uploadFiles(req, res));
module.exports = router;
