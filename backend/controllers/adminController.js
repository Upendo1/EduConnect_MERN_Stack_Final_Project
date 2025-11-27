import Resource from "../models/Resource.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

// -----------------------------
// GET ADMIN STATS
// -----------------------------
export const getAdminStats = async (req, res) => {
  try {
    // User counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    // Resource + Category counts
    const totalResources = await Resource.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Views & downloads
    const resources = await Resource.find();

    const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalResources,
      totalCategories,
      totalViews,
      totalDownloads,
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// -----------------------------
// GET RECENT ACTIVITY
// -----------------------------
export const getAdminRecentActivity = async (req, res) => {
  try {
    const recentActivity = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("teacher", "fullName name role") // ← your model uses "teacher"
      .populate("category", "name");

    res.json(recentActivity);
  } catch (err) {
    console.error("Recent activity error:", err);
    res.status(500).json({ message: "Failed to load recent activity" });
  }
};
