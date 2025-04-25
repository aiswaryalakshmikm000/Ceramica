
const Coupon = require("../../models/couponModel");
const mongoose = require("mongoose");

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
    customerType,
  } = req.body;

  try {
    if (!code || !description || !discountType || !minPurchaseAmount || !usageLimit || !maxUsagePerUser) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
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
      customerType: customerType || "all",
      userId: null,
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

const getCoupons = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

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
      query.status = { $in: ["active", "expired", "inactive", "exhausted"] };
    }

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean();

    const now = new Date();
    const updatedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        if (new Date(coupon.expiryDate) < now && coupon.status === "active") {
          await Coupon.updateOne(
            { _id: coupon._id },
            { $set: { status: "expired" } }
          );
          return { ...coupon, status: "expired" };
        }
        if (
          coupon.totalAppliedCount >= coupon.usageLimit &&
          coupon.status === "active"
        ) {
          await Coupon.updateOne(
            { _id: coupon._id },
            { $set: { status: "exhausted" } }
          );
          return { ...coupon, status: "exhausted" };
        }
        return coupon;
      })
    );

    const totalCouponsCount = await Coupon.countDocuments(query);

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