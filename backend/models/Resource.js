// const mongoose = require("mongoose");

// const resourceSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   file_type: String,
//   file_url: String,
//   file_size: Number,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   created_at: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Resource", resourceSchema);
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    file_url: {
      type: String,
      required: true,
    },

    file_type: {
      type: String,
      required: true,
    },

    file_size: {
      type: Number,
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", ResourceSchema);
