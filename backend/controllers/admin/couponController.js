// backend/controllers/admin/couponController.js
const Coupon = require("../../models/couponModel");
const Category = require("../../models/categoryModel");
const Product = require("../../models/productModel");
const mongoose = require("mongoose");

// Add a new coupon (unchanged)
const createCoupon = async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    discountPercentage,
    minPurchaseAmount,
    maxDiscountAmount,
    validFrom,
    expiryDate,
    usageLimit,
    maxUsagePerUser,
    applicableCategories,
    applicableProducts,
    customerType,
  } = req.body;
console.log("$$$$$$$$$$$$$$$$$$", req.body)
  try {
    if (!code || !description || !discountType || !minPurchaseAmount || !usageLimit || !maxUsagePerUser) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    if (applicableCategories?.length > 0) {
      const categories = await Category.find({
        _id: { $in: applicableCategories },
        isListed: true,
      });
      if (categories.length !== applicableCategories.length) {
        return res.status(400).json({ success: false, message: "One or more categories are unlisted or invalid" });
      }
    }
    if (applicableProducts?.length > 0) {
      const products = await Product.find({
        _id: { $in: applicableProducts },
        isListed: true,
      }).populate("categoryId");
      if (products.length !== applicableProducts.length) {
        return res.status(400).json({ success: false, message: "One or more products are unlisted or invalid" });
      }
      const invalidProducts = products.filter((product) => !product.categoryId.isListed);
      if (invalidProducts.length > 0) {
        return res.status(400).json({ success: false, message: "One or more products belong to unlisted categories" });
      }
    }
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }
    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: discountType === "flat" ? discountValue : undefined,
      discountPercentage: discountType === "percentage" ? discountPercentage : undefined,
      minPurchaseAmount,
      maxDiscountAmount: discountType === "percentage" ? maxDiscountAmount : undefined,
      validFrom: validFrom || Date.now(),
      expiryDate,
      usageLimit,
      maxUsagePerUser,
      applicableCategories: applicableCategories || [],
      applicableProducts: applicableProducts || [],
      customerType: customerType || "all",
    });
    await coupon.save();
    res.status(201).json({ success: true, message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding the coupon.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Show coupons with filters and pagination
const getCoupons = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    console.log("@###################### req.query:", req.query);

    const query = {};

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ["active", "expired"] };
    }

    console.log("@###################### query:", query);

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Fetch coupons
    const coupons = await Coupon.find(query)
      .populate("applicableCategories", "name")
      .populate("applicableProducts", "name")
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const now = new Date();
    // Update coupons that should be expired
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        if (new Date(coupon.expiryDate) < now && coupon.status === "active") {
          await Coupon.updateOne(
            { _id: coupon._id },
            { $set: { status: "expired" } }
          );
          return { ...coupon, status: "expired" };
        }
        return coupon;
      })
    );

    console.log("@###################### coupons:", updatedCoupons.map(c => ({ code: c.code, status: c.status })));

    const totalCouponsCount = await Coupon.countDocuments(query);

    console.log("@###################### totalCouponsCount:", totalCouponsCount);

    res.status(200).json({
      success: true,
      totalCouponsCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCouponsCount / parsedLimit),
      coupons: updatedCoupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching coupons.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Soft delete a coupon
const deleteCoupon = async (req, res) => {
  const { couponId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(couponId)) {
      return res.status(400).json({ success: false, message: "Invalid coupon ID" });
    }
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    if (coupon.status === "inactive") {
      return res.status(400).json({ success: false, message: "Coupon is already deactivated" });
    }
    coupon.status = "inactive";
    await coupon.save();
    res.status(200).json({ success: true, message: "Coupon deactivated successfully", coupon });
  } catch (error) {
    console.error("Error deactivating coupon:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deactivating the coupon.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
};