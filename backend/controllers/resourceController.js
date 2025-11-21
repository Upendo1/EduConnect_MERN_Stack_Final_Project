const Resource = require('../models/Resource');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkikwqxtr',
  api_key: process.env.CLOUDINARY_API_KEY || '994221665445739',
  api_secret: process.env.CLOUDINARY_API_SECRET || '**********',
});

const uploadBufferToCloudinary = (buffer, resourceType='auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const file = req.file;
    // determine resource type
    const mime = file.mimetype;
    let resourceType = 'auto';
    if (mime.startsWith('image/')) resourceType = 'image';
    else if (mime.startsWith('video/')) resourceType = 'video';
    else resourceType = 'raw'; // for pdfs, docs, etc.

    const result = await uploadBufferToCloudinary(file.buffer, resourceType);
    const resource = await Resource.create({
      title: req.body.title || file.originalname,
      description: req.body.description || '',
      fileType: mime,
      fileUrl: result.secure_url,
      uploadedBy: req.user._id,
    });
    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name email role').sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email role');
    if (!resource) return res.status(404).json({ message: 'Not found' });
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    // optional: delete from cloudinary (if public_id available). We stored secure_url only; skipping deletion.
    await resource.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
