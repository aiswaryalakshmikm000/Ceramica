
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

// Fetch all products with search, category, status, stock filter, and pagination
const showProducts = async (req, res) => {
  try {
    const { search, categoryIds, isListed, stockFilter, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Search by name, description, or tags
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { tags: { $regex: new RegExp(search, "i") } },
      ];
    }

    // Filter by multiple categories (expects comma-separated categoryIds)
    if (categoryIds) {
      const categoriesArray = categoryIds.split(",");
      filter.categoryId = { $in: categoriesArray };
    }

    // Filter by listing status
    if (isListed !== undefined) {
      filter.isListed = isListed === "true";
    }

    // Filter by stock status
    if (stockFilter) {
      if (stockFilter === "inStock") {
        filter.totalStock = { $gt: 0 };
      } else if (stockFilter === "outOfStock") {
        filter.totalStock = 0;
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalProductsCount: totalProducts,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
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
  console.log("Request body:", req.body);
  console.log("Request files:", req.files || "No files received");

  let { name, description, price, discount, categoryId, tags, colors, updatedUrls, deletedImages } = req.body;
  const files = req.files || {};

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const productExist = await Product.findOne({ _id });
    if (!productExist) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productWithSameName = await Product.findOne({
      _id: { $ne: _id },
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (productWithSameName) {
      return res.status(400).json({ message: "Product with same name already exists" });
    }

    // Parse incoming data
    const parsedColors = colors ? JSON.parse(colors) : productExist.colors;
    updatedUrls = updatedUrls ? JSON.parse(updatedUrls) : [];
    deletedImages = deletedImages ? JSON.parse(deletedImages) : [];

    // Handle new image uploads per color variant
    const imageUploads = {};
    for (let fieldName in files) {
      const uploadedFiles = files[fieldName];
      const imageUrls = await Promise.all(
        uploadedFiles.map(file => cloudinaryImageUploadMethod(file.buffer))
      );
      imageUploads[fieldName] = imageUrls;
    }

    // Update colors with images
    const colorsWithImages = parsedColors.map((color, index) => {
      const existingColor = productExist.colors.find(c => c.name === color.name) || {};
      const fieldName = `color${index}Images`;
      const newImages = imageUploads[fieldName] || []; // New images for this variant
      const existingImages = existingColor.images || [];

      // Filter out deleted images and retain only those in updatedUrls for this variant
      const retainedImages = existingImages.filter(img => 
        !deletedImages.includes(img) && (updatedUrls.includes(img) || newImages.includes(img))
      );

      return {
        name: color.name,
        stock: Number(color.stock),
        images: [...retainedImages, ...newImages],
      };
    });

    // Update product fields
    const updatedProduct = {
      name: name || productExist.name,
      description: description || productExist.description,
      price: price ? Number(price) : productExist.price,
      discount: discount ? Number(discount) : productExist.discount,
      categoryId: categoryId || productExist.categoryId,
      tags: tags ? JSON.parse(tags) : productExist.tags,
      colors: colorsWithImages,
    };

    Object.assign(productExist, updatedProduct);
    const editedProduct = await productExist.save();

    console.log("Updated product successfully:", editedProduct);
    res.status(200).json({ message: "Product edited successfully", product: editedProduct });
  } catch (error) {
    console.error("Error editing product:", error.message);
    res.status(500).json({
      message: "Something went wrong while editing the product.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
