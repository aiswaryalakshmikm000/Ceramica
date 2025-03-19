const Product = require("../../models/productModel");


const mongoose = require("mongoose");


const viewProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID format." });
 }
  
  try {
    if (!id) {
      console.log("Invalid product Id");
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id." });
    }
    // Fetch the product only if it is listed
    let product = await Product.findOne({ _id: id, isListed: true })
      .populate("categoryId", "name")

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found or not listed." });
      }
      
     // Fetch related products from the same category (excluding the current product)
      const relatedProducts=await Product.find({categoryId:product.categoryId, _id:{$ne:id}, isListed: true}).populate('categoryId')
  
    res
      .status(200)
      .json({ success: true, message: "product fetched", product: product, relatedProducts: relatedProducts });
  } catch (error) {
    console.log("Error in viewProduct:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};


const fetchProducts = async (req, res) => {
  try {
    let { search, categoryIds, minPrice, maxPrice, sort, page = 1, limit = 10, reset } = req.query;

    // ✅ If reset is true, clear all filters
    if (reset === "true") {
      search = categoryIds = minPrice = maxPrice = brand = sort = null;
    }

    let filter = { isListed: true }; // ✅ Ensure only listed products are shown

    // ✅ Search by name, description, or tags
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { tags: { $regex: new RegExp(search, "i") } },
      ];
    }

    // ✅ Filter by multiple categories (expects comma-separated categoryIds)
    if (categoryIds) {
      console.log("categoryIds:" , categoryIds);
      
      const categoriesArray = categoryIds.split(","); 
      filter.categoryId = { $in: categoriesArray };
    }

    // ✅ Filter by price range
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = parseFloat(maxPrice);
    }

    // ✅ Sorting logic
    let sortOptions = {};
    if (sort === "priceLowHigh") sortOptions.discountedPrice = 1;
    if (sort === "priceHighLow") sortOptions.discountedPrice = -1;
    if (sort === "nameAZ") sortOptions.name = 1;
    if (sort === "nameZA") sortOptions.name = -1;
    if (sort === "popularity") sortOptions.totalStock = -1; // Assuming popularity is based on stock
    if (sort === "averageRating") sortOptions["avgRating"] = -1; // Assuming avgRating is calculated
    if (sort === "newArrivals") sortOptions.createdAt = -1;
    if (sort === "featured") sortOptions.isFeatured = -1;

    // ✅ Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    console.log('Filter:', filter);
    console.log('Sort:', sortOptions);

    // ✅ Count total matching products for pagination
    const totalProducts = await Product.countDocuments(filter);

    // ✅ Fetch products with filters, sorting, and pagination
    const products = await Product.find(filter)
      .populate("categoryId", "name") // Populate category name
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

      console.log('Found products:', products);
      
    res.status(200).json({
      success: true,
      totalProductsCount: totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

    console.log("products:", products)
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Something went wrong while fetching products." });
  }
};



const fetchBestProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Default to 10 best products

    // ✅ Define sorting criteria for best products
    const sortOptions = {
      isFeatured: -1,   // Show featured products first
      avgRating: -1,    // Highest-rated products
      totalStock: -1,   // Most popular based on stock availability
      createdAt: -1,    // New arrivals as fallback
    };

    // ✅ Fetch best products (only listed products)
    const bestProducts = await Product.find({ isListed: true })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .populate("categoryId", "name"); // Populate category name

    res.status(200).json({
      success: true,
      bestProducts,
    });
  } catch (error) {
    console.error("Error fetching best products:", error);
    res.status(500).json({ success: false, message: "Something went wrong while fetching best products." });
  }
};


const fetchFeaturedProducts = async (req, res) => {
    try {
      const { limit = 10 } = req.query; // Default to 10 featured products
  
      // ✅ Fetch only featured and listed products
      const featuredProducts = await Product.find({ isFeatured: true, isListed: true })
        .sort({ createdAt: -1 }) // Sort by newest featured products
        .limit(parseInt(limit))
        .populate("categoryId", "name"); // Populate category name
  
      res.status(200).json({
        success: true,
        featuredProducts,
      });
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ success: false, message: "Something went wrong while fetching featured products." });
    }
  };

module.exports = {  viewProduct, fetchProducts, fetchBestProducts, fetchFeaturedProducts };
