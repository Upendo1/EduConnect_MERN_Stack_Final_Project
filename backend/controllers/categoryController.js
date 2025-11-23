const Category = require("../models/Category");
const Resource = require("../models/Resource");

// ----------------------------------------------
// GET ALL CATEGORIES
// GET /categories
// ----------------------------------------------
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// ----------------------------------------------
// CREATE CATEGORY
// POST /categories
// ----------------------------------------------
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------
// COUNT RESOURCES IN A CATEGORY
// GET /resources/byCategory/:categoryId
// --------------------------------------------------------------
exports.getResourceCountByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const count = await Resource.countDocuments({ category: categoryId });

    res.json({ count });
  } catch (error) {
    console.error("Category Count Error:", error);
    res.status(500).json({ message: "Failed to count resources" });
  }
};
