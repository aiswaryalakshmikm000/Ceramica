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
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id." });
    }
    let product = await Product.findOne({ _id: id, isListed: true })
      .select(
        "_id name price discount discountedPrice colors primaryImage totalStock createdAt categoryId description"
      )
      .populate({
        path: "categoryId",
        select: "name isListed",
        match: { isListed: true },
      });

    if (!product || !product.categoryId) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not listed, or category not listed.",
      });
    }

    const relatedProducts = await Product.find({
      categoryId: product.categoryId._id,
      _id: { $ne: id },
      isListed: true,
    })
      .select(
        "_id name price discount discountedPrice colors primaryImage totalStock description"
      )
      .populate({
        path: "categoryId",
        select: "name isListed ",
        match: { isListed: true },
      })
      .limit(6);

    res.status(200).json({
      success: true,
      message: "product fetched",
      product: product,
      relatedProducts: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const fetchProducts = async (req, res) => {
  try {
    let {
      search,
      categoryIds,
      minPrice,
      maxPrice,
      colors,
      sort,
      page = 1,
      limit,
      reset,
    } = req.query;

    if (reset === "true") {
      search = categoryIds = minPrice = maxPrice = sort = null;
    }

    let filter = { isListed: true };

    if (sort === "featured") {
      filter.isFeatured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { tags: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (categoryIds) {
      const categoryArray = categoryIds.split(",").map((id) => {
        try {
          return new mongoose.Types.ObjectId(id.trim());
        } catch {
          throw new Error(`invalid categoryId: ${id}`);
        }
      });
      filter.categoryId = { $in: categoryArray };
    }

    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = parseFloat(maxPrice);
    }

    if (colors) {
      const colorArray = colors.split(",").map((color) => color.trim());
      filter["colors.name"] = { $in: colorArray };
    }

    let sortOptions = {};
    if (sort === "priceLowHigh") sortOptions.discountedPrice = 1;
    else if (sort === "priceHighLow") sortOptions.discountedPrice = -1;
    else if (sort === "nameAZ") sortOptions.name = 1;
    else if (sort === "nameZA") sortOptions.name = -1;
    else if (sort === "popularity") sortOptions.totalStock = -1;
    else if (sort === "averageRating") sortOptions.avgRating = -1;
    else if (sort === "newArrivals") sortOptions.createdAt = -1;
    else if (sort === "featured") {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = -1;
    }
    const collation = (sort === "nameAZ" || sort === "nameZA") 
    ? { locale: "en", strength: 2 } 
    : undefined;


    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const aggregatePipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $match: { "category.isListed": true } },
    ];

    const totalResult = await Product.aggregate([
      ...aggregatePipeline,
      { $count: "total" },
    ]);
    const totalProducts = totalResult.length > 0 ? totalResult[0].total : 0;

    const products = await Product.aggregate([
      ...aggregatePipeline,
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          price: 1,
          discount: 1,
          discountedPrice: 1,
          colors: 1,
          totalStock: 1,
          categoryId: "$category._id",
          categoryName: "$category.name",
          categoryIsListed: "$category.isListed",
          isFeatured: 1,
          createdAt: 1,
        },
      },
    ]).collation(collation);

    res.status(200).json({
      success: true,
      totalProductsCount: totalProducts,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      filteredProducts: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }
};

const fetchFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const featuredProducts = await Product.find({
      isFeatured: true,
      isListed: true,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate({
        path: "categoryId",
        select: "name isListed",
        match: { isListed: true },
      });

    const filteredFeaturedProducts = featuredProducts.filter(
      (product) => product.categoryId
    );

    res.status(200).json({
      success: true,
      filteredFeaturedProducts,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching featured products.",
    });
  }
};

module.exports = {
  viewProduct,
  fetchProducts,
  // fetchBestProducts,
  fetchFeaturedProducts,
};
