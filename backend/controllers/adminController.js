import Resource from "../models/Resource.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

// 👉 GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalResources = await Resource.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get views & downloads
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
// export const getAdminStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalResources = await Resource.countDocuments();
//     const totalCategories = await Category.countDocuments();

//     const latestResources = await Resource.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("category");
//     //   .populate("uploadedBy", "fullName email role");

//     res.json({
//       totalUsers,
//       totalResources,
//       totalCategories,
//       latestResources,
//     });
//   } catch (err) {
//     console.error("Admin stats error:", err);
//     res.status(500).json({ message: "Failed to load admin stats" });
//   }
// };

// 👉 GET /api/admin/activity
export const getAdminRecentActivity = async (req, res) => {
  try {
    const recentActivity = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("uploadedBy", "fullName role")
      .populate("category", "name");

    res.json(recentActivity);
  } catch (err) {
    console.error("Recent activity error:", err);
    res.status(500).json({ message: "Failed to load recent activity" });
  }
};
