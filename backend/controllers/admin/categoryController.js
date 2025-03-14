const Category = require("../../models/categoryModel");
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
  const { name, description } = req.body;
  try {

    if (!name || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    //check if category exist
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      console.log("error in category req body", error);

      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: error.details.map((details) => details.message),
      });
    }
    const categoryExist = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (categoryExist) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exist!" });
    }
    const newCategory = await Category.create({
      name,
      description,
    });
    console.log("Category added");
    res.status(200).json({ success: true, message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.log("error in adding category", error.message);
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
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
    console.log("error in listing categories".error.message);
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const editCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const data = req.body; //updated category information
    const { name } = req.body;


    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(catId)) {
        return res.status(400).json({ success: false, message: "Invalid category ID" });
    }
    
    // Validate input data
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      console.log("Error in category req body", error);

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

     // Check if category exists before updating
     const existingCategory = await Category.findById(catId);
     if (!existingCategory) {
       return res
         .status(404)
         .json({ success: false, message: "Category not found!" });
     }

    // Check if category name already exists (excluding the current category)
    const categoryExist = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (categoryExist && categoryExist._id != catId) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exist!" });
    }

    // Update category
    const updatedData = await Category.findByIdAndUpdate(catId, data, {  //finf by id and updates with data
      new: true,  //true ensures the response contains the updated document.
    });

    // Handle case where category is not found
    if (updatedData) {
      res
        .status(200)
        .json({ success: true, message: "Category updated successfully", updatedData });
    }
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
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
