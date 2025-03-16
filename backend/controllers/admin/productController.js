
const Product = require("../../models/productModel");
const productValidationSchema = require('../../utils/validation/productValidation')
const mongoose = require("mongoose");

const { cloudinaryImageUploadMethod } = require("../../utils/cloudinary/cloudinaryUpload");
const cloudinaryDeleteImages = require('../../utils/cloudinary/deleteImages')



// Add product function
const addProduct = async (req, res) => {

  console.log("req.body", req.body)
  console.log("req.files", req.files)

  const { name, description, price, discount, offerId, categoryId, tags, colors } = req.body;

  
  try {
    // Check for existing product
    const productExist = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    console.log("existing product:",  productExist)
    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Parse colors (JSON string from FormData)
    const parsedColors = JSON.parse(colors);
    console.log("parsedColors:",parsedColors)

    // Validate images (at least 3 total across all variants)
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("images are required for color varient")
      return res.status(400).json({ message: "Images are required for color variants." });
    }

   

    let totalImages = 0;
    const colorsWithImages = await Promise.all(
      parsedColors.map(async (color, index) => {
        const fieldName = `color${index}Images`; // Expecting images as color0Images, color1Images, etc.
        const files = req.files[fieldName];

        if (!files || files.length === 0) {
          throw new Error(`No images provided for color variant: ${color.name}`);
        }

        totalImages += files.length;

        // Upload images for this variant to Cloudinary
        const imageUrls = await Promise.all(
          files.map((file) => cloudinaryImageUploadMethod(file.buffer))
        );

        return {
          name: color.name,
          stock: Number(color.stock),
          images: imageUrls,
        };
      })
    );

    // Enforce minimum 3 images total
    if (totalImages < 3) {
      return res.status(400).json({ message: "At least 3 images are required across all color variants." });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      offerId: offerId || null,
      categoryId,
      tags: tags ? JSON.parse(tags) : [],
      colors: colorsWithImages,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Something went wrong while adding the product.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// Fetch all products with search, filter, sort, pagination, and reset
const showProducts = async (req, res) => {
  try {
    let { search, categoryIds, minPrice, maxPrice, sort, page = 1, limit = 10, reset, isListed, stockFilter } = req.query;

    // If reset is true, return all products without filters
    if (reset === "true") {
      search = categoryIds = minPrice = maxPrice = sort = null;
    }

    let filter = {};

    // Search by name, description, or tags
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } }, // Search by name
        { description: { $regex: new RegExp(search, "i") } }, // Search by description
        { tags: { $regex: new RegExp(search, "i") } }, // Search by tags (assuming `tags` is an array)
      ];
    }

    // Filter by multiple categories (expects comma-separated categoryIds)
    if (categoryIds) {
      const categoriesArray = categoryIds.split(","); // Convert comma-separated IDs to array
      filter.categoryId = { $in: categoriesArray };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter by listing status
    if (isListed !== undefined) { // Check for undefined explicitly since 'false' is a valid value
      filter.isListed = isListed === "true"; // Convert string 'true'/'false' to boolean
    }

    // Filter by stock status
    if (stockFilter) {
      if (stockFilter === "inStock") {
        filter.totalStock = { $gt: 0 }; // Products with stock > 0
      } else if (stockFilter === "outOfStock") {
        filter.totalStock = 0; // Products with stock = 0
      }
    }
    
    // Sorting logic
    let sortOptions = {};
    if (sort === "priceLowHigh") sortOptions.price = 1;
    if (sort === "priceHighLow") sortOptions.price = -1;
    if (sort === "nameAZ") sortOptions.name = 1;
    if (sort === "nameZA") sortOptions.name = -1;
    if (sort === "popularity") sortOptions.totalStock = -1; // Assuming popularity is based on stock
    if (sort === "averageRating") sortOptions["reviews.rating"] = -1; // Sort by highest rating
    if (sort === "newArrivals") sortOptions.createdAt = -1;
    if (sort === "featured") sortOptions.isFeatured = -1;

    // Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filter);

    // ✅ Fetch products with filters, sorting, and pagination
    const products = await Product.find(filter)
      .populate("categoryId", "name") // Populate category name
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalProductsCount: totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Something went wrong while fetching products." });
  }
};



//to list or unlist products
const updateProductStatus = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      console.log("Product not found in the database.");

      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    console.log("Product found:", product);

    product.isListed = !product.isListed;

    await product.save();
   
    // Fetch the updated product to send fresh data
    const updatedProduct = await Product.findById(id);

    console.log("product list status updated");

    res.status(200).json({ success: true, message: "Poduct status changed", product: updatedProduct });
  } catch (error) {
    console.log("error in updating status", error);
    res
      .status(error?.status || 500)
      .json({ message: error || "Something went wrong" });
  }
};


const showProduct = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    console.log(`Searching for product with _id: ${_id}`);

    const product = await Product.findById(_id).populate("categoryId", "name");

    if (!product) {
      console.log(`No product found with _id: ${_id}`);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("Product found:", product);

    res.status(200).json({ success: true, message: "Product details fetched", product });
  } catch (error) {
    console.error("Error in fetching product:", error);
    res.status(500).json({ 
      success: false, 
      message: "Fetching product failed", 
      error: error.message 
    });
  }
};

const editProduct = async (req, res) => {
  const { _id } = req.params;
  let { name, categoryId, updatedUrls, deletedImages } = req.body;

  const files = req.files || [];
  const updatedProduct = req.body;

  console.log(`Editing product with _id: ${_id}`);

  try {
    // Check if _id is valid
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Parse JSON fields from FormData
    deletedImages = deletedImages ? JSON.parse(deletedImages) : [];
    updatedUrls = updatedUrls ? JSON.parse(updatedUrls) : [];

    // Find the product
    const productExist = await Product.findOne({ _id });
    if (!productExist) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("exist", productExist);

    // Check for duplicate product name
    const productWithSameName = await Product.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(_id) },
      name
    });

    if (productWithSameName) {
      return res.status(400).json({
        message: "Product with same name already exists.",
        productWithSameName
      });
    }

    // Delete previous images
    if (deletedImages.length > 0) {
      try {
        const deleteResults = await cloudinaryDeleteImages(deletedImages);
        console.log("del", deleteResults);
      } catch (error) {
        console.log("Error deleting images:", error);
      }
    }

    // Handle new image uploads
    const imageUrls = [];
    for (let file of files) {
      const imageUrl = await cloudinaryImageUploadMethod(file.buffer);
      imageUrls.push(imageUrl);
    }

    // Merge new images with existing ones
    updatedProduct.images = [...(updatedUrls || []), ...imageUrls];

    // Update the product
    Object.assign(productExist, updatedProduct);
    const editedProduct = await productExist.save();

    console.log("Updated product successfully:", editedProduct);
    res.status(200).json({ message: "Product edited successfully", product: editedProduct });

  } catch (error) {
    console.error("Error editing product:", error.message);
    res.status(500).json({
      message: "Something went wrong while editing the product.",
      error: error.message
    });
  }
};


module.exports = {
  addProduct,
  showProducts,
  updateProductStatus,
  showProduct,
  editProduct,
};
