const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
    },
    images: {
      type: String,
      required: true
    },
    isListed: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
