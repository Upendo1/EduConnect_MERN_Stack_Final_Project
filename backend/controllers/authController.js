const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }
    if (!fullName) {
      return res.status(400).json({ message: "Name required" });
    }

    // Validate role
    const allowedRoles = ["student", "teacher", "admin"];
    const finalRole = allowedRoles.includes(role) ? role : "student";

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashed,
      fullName,
      role: finalRole,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName, // FIXED
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });

    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName, // FIXED
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.me = async (req, res) => {
  res.json({ user: req.user });
};
