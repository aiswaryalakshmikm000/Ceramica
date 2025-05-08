const Product = require("../../models/productModel");
const mongoose = require("mongoose");

const { cloudinaryImageUploadMethod } = require("../../utils/cloudinary/cloudinaryUpload");

const addProduct = async (req, res) => {

  const { name, description, price, discount, offerId, categoryId, tags, colors, isFeatured } = req.body;

  try {
    const productExist = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const parsedColors = JSON.parse(colors);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Images are required for color variants." });
    }

    let totalImages = 0;
    const colorsWithImages = await Promise.all(
      parsedColors.map(async (color, index) => {
        const fieldName = `color${index}Images`; 
        const files = req.files[fieldName];

        if (!files || files.length === 0) {
          throw new Error(`No images provided for color variant: ${color.name}`);
        }

        totalImages += files.length;

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

    if (totalImages < 3) {
      return res.status(400).json({ message: "At least 3 images are required across all color variants." });
    }

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      offerId: offerId || null,
      categoryId,
      tags: tags ? JSON.parse(tags) : [],
      colors: colorsWithImages,
      isFeatured: isFeatured === "true" || false,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while adding the product.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


const showProducts = async (req, res) => {
  try {
    const { search, categoryIds, isListed, stockFilter, page = 1, limit = 10 } = req.query;

    let filter = {};
  
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (categoryIds) {
      const categoriesArray = categoryIds.split(",");
      filter.categoryId = { $in: categoriesArray };
    }

    if (isListed !== undefined) {
      filter.isListed = isListed === "true";
    }

    if (stockFilter) {
      if (stockFilter === "inStock") {
        filter.totalStock = { $gt: 0 };
      } else if (stockFilter === "outOfStock") {
        filter.totalStock = 0;
      }
    }

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
    res.status(500).json({ message: "Something went wrong while fetching products." });
  }
};


const updateProductStatus = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    product.isListed = !product.isListed;

    await product.save();
   
    const updatedProduct = await Product.findById(id);

    res.status(200).json({ success: true, message: "Poduct status changed", product: updatedProduct });
  } catch (error) {
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
    const product = await Product.findById(_id).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product details fetched", product });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Fetching product failed", 
      error: error.message 
    });
  }
};


const editProduct = async (req, res) => {
  const { _id } = req.params;

  let { name, description, price, discount, categoryId, tags, colors, updatedUrls, deletedImages, isFeatured } = req.body;
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

    const parsedColors = colors ? JSON.parse(colors) : productExist.colors;
    updatedUrls = updatedUrls ? JSON.parse(updatedUrls) : [];
    deletedImages = deletedImages ? JSON.parse(deletedImages) : [];

    const imageUploads = {};
    for (let fieldName in files) {
      const uploadedFiles = files[fieldName];
      const imageUrls = await Promise.all(
        uploadedFiles.map(file => cloudinaryImageUploadMethod(file.buffer))
      );
      imageUploads[fieldName] = imageUrls;
    }

    const colorsWithImages = parsedColors.map((color, index) => {
      const existingColor = productExist.colors.find(c => c.name === color.name) || {};
      const fieldName = `color${index}Images`;
      const newImages = imageUploads[fieldName] || []; 
      const existingImages = existingColor.images || [];

      const retainedImages = existingImages.filter(img => 
        !deletedImages.includes(img) && (updatedUrls.includes(img) || newImages.includes(img))
      );

      return {
        name: color.name,
        stock: Number(color.stock),
        images: [...retainedImages, ...newImages],
      };
    });

    const updatedProduct = {
      name: name || productExist.name,
      description: description || productExist.description,
      price: price ? Number(price) : productExist.price,
      discount: discount ? Number(discount) : productExist.discount,
      categoryId: categoryId || productExist.categoryId,
      tags: tags ? JSON.parse(tags) : productExist.tags,
      colors: colorsWithImages,
      isFeatured: isFeatured !== undefined ? isFeatured === "true" : productExist.isFeatured,
    };

    Object.assign(productExist, updatedProduct);
    const editedProduct = await productExist.save();
    res.status(200).json({ message: "Product edited successfully", product: editedProduct });
  } catch (error) {
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
