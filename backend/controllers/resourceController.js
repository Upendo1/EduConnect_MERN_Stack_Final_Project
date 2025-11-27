const Resource = require("../models/Resource");
const Category = require("../models/Category");

// -----------------------------
// GET ALL RESOURCES
// -----------------------------
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("category", "name")
      .populate("teacher", "name");

    res.json(resources);
  } catch (error) {
    console.error("Get Resources Error:", error);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};

// -----------------------------
// CREATE RESOURCE (upload)
// -----------------------------

const BASE_URL = "https://educonnect-mern-stack-final-project.onrender.com";

export const createResource = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!req.body.category || req.body.category.trim() === "") {
      return res.status(400).json({ message: "Category is required" });
    }

    // Build full public URL
    const fileUrl = `${BASE_URL}/uploads/${file.filename}`;

    const resource = await Resource.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      teacher: req.user._id,
    });

    res.json(resource);
  } catch (error) {
    console.error("Create Resource Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
// -----------------------------
// GET RECENT RESOURCES
// -----------------------------
exports.getRecentResources = async (req, res) => {
  try {
    const recent = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("category", "name")
      .populate("teacher", "name");

    res.json(recent);
  } catch (error) {
    console.error("Get Recent Resources Error:", error);
    res.status(500).json({ message: "Failed to fetch recent resources" });
  }
};

// -----------------------------
// GET RESOURCES BY CATEGORY
// -----------------------------
exports.getResourcesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const resources = await Resource.find({ category: categoryId })
      .populate("category", "name")
      .populate("teacher", "name");

    res.json(resources);
  } catch (error) {
    console.error("Get By Category Error:", error);
    res.status(500).json({ message: "Failed to fetch category resources" });
  }
};

// -----------------------------
// DELETE RESOURCE
// -----------------------------
exports.deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete resource" });
  }
};

// -----------------------------
// ANALYTICS
// -----------------------------
exports.getAnalytics = async (req, res) => {
  try {
    const resources = await Resource.find();

    const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalDownloads = resources.reduce(
      (sum, r) => sum + (r.downloads || 0),
      0
    );

    res.json({
      totalResources: resources.length,
      totalViews,
      totalDownloads,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

// -----------------------------
// TRACK VIEW
// -----------------------------
exports.trackView = async (req, res) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Track View Error:", err);
    res.status(500).json({ error: "Failed to track view" });
  }
};

// -----------------------------
// TRACK DOWNLOAD
// -----------------------------
exports.trackDownload = async (req, res) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, {
      $inc: { downloads: 1 },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Track Download Error:", err);
    res.status(500).json({ error: "Failed to track download" });
  }
};

// exports.viewResourceFile = async (req, res) => {
//   try {
//     const resource = await Resource.findById(req.params.id);

//     if (!resource) {
//       return res.status(404).json({ message: "Resource not found" });
//     }

//     const filePath = path.resolve(resource.file_url);

//     return res.sendFile(filePath);
//   } catch (error) {
//     console.error("View Resource File Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.viewResourceFile = async (req, res) => {
  try {
    console.log("VIEW FILE ID:", req.params.id);

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // ensure backend directory is used
    const filePath = path.join(__dirname, "..", resource.file_url);

    // console.log("SERVING FILE:", filePath);

    return res.sendFile(filePath);
  } catch (error) {
    console.error("View Resource File Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
