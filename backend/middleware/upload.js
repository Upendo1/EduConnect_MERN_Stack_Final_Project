const multer = require('multer');
const storage = multer.memoryStorage(); // we'll upload buffer to Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;
