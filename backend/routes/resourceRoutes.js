const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  getResources,
  createResource,
  deleteResource,
  getAnalytics,
  getRecentResources,
  getResourcesByCategory,
  trackView,
  trackDownload,
  viewResourceFile
} = require("../controllers/resourceController");

// Get ALL resources
router.get("/", getResources);

// Get recent resources
router.get("/recent", getRecentResources);

// Get resources by category
router.get("/byCategory/:categoryId", getResourcesByCategory);

// Create resource
router.post("/", auth, upload.single("file"), createResource);

// Delete resource
router.delete("/:id", auth, deleteResource);

// Analytics
router.get("/analytics", getAnalytics);

// Track view
router.post("/:id/view", trackView);

// Track download
router.post("/:id/download", trackDownload);
router.get("/:id/view", viewResourceFile);
module.exports = router;
