import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  full_name: String,
  avatar_url: String,
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Profile", ProfileSchema);