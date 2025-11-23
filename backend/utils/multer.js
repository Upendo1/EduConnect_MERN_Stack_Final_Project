const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Uploads directory (default: ./uploads)
const uploads = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploads);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

module.exports = multer({ storage });
