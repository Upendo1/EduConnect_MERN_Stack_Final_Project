const Resource = require("../models/Resource");

exports.createResource = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const resource = await Resource.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      file_url: file.path,
      file_type: file.mimetype,
      file_size: file.size,
      teacher: req.user.id
    });

    res.json(resource);

  } catch (error) {
    console.error("Create Resource Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getResources = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    const resources = await Resource.find(filter)
      .populate("teacher", "name")
      .populate("category", "name");

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};

exports.trackView = async (req, res) => {
  res.json({ message: "View tracked" });
};

exports.trackDownload = async (req, res) => {
  res.json({ message: "Download tracked" });
};
