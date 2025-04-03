const Category = require("../../models/categoryModel");
const { cloudinaryImageUploadMethod } = require("../../utils/cloudinary/cloudinaryUpload");
const {cloudinaryDeleteImages} = require("../../utils/cloudinary/deleteImages");
const categoryValidationSchema = require("../../utils/validation/categoryValidation");

const mongoose = require("mongoose");

const showCategories = async (req, res) => {
    try {
      const categories = await Category.find({});
      
      if (categories.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No categories available." });
      }
      res
        .status(200)
        .json({ success: true, message: "Categories fetched successfully.", categories });
  
    } catch (error) {
      console.error("Error in fetching categories:", error);
      res
        .status(error?.status || 500)
        .json({ success: false, message: error.message || "Something went wrong" });
    }
  };
  
  
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.file;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    const categoryExist = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (categoryExist) {
      return res.status(409).json({ success: false, message: "Category already exists!" });
    }

    let imageUrl = "";
    if (file) {
      imageUrl = await cloudinaryImageUploadMethod(file.buffer);
    }

    const newCategory = await Category.create({
      name,
      description,
      images: imageUrl || "",
    });

    res.status(200).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const listCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {

    // Validate MongoDB ObjectId
   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ success: false, message: "Invalid category ID" });
  }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Toggle isListed status
    category.isListed = !category.isListed;
    await category.save();

    res
      .status(200)
      .json({ success: true, message: "Category status changed.", category });
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};


const editCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const category = await Category.findById(catId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }


    let imageUrl = category.images;
    if (file) {
      // Delete old image if it exists
      if (category.images) {
        await cloudinaryDeleteImages([category.images]);
      }
      imageUrl = await cloudinaryImageUploadMethod(file.buffer);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      catId,
      {
        name,
        description,
        images: imageUrl,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const showCategory = async (req, res) => {
  const { catId } = req.params;
  try {

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(catId)) {
        return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    // Fetch category from the database
    const category = await Category.findById(catId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Send response
    res
      .status(200)
      .json({ success: true, message: "Fetched category details", category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  showCategories,
  addCategory,
  editCategory,
  listCategory,
  showCategory,
};
