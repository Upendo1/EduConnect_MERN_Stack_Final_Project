import Profile from "../models/Profile.js";

export const getOrCreateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ userId });

    // If profile does not exist → create it
    if (!profile) {
      profile = await Profile.create({
        userId,
        full_name: "",         // You can update this from registration
        avatar_url: null,
        role: "student",       // Default unless user is teacher/admin
      });
    }

    return res.json(profile);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error loading profile" });
  }
};
