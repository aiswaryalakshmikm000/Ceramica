const Coupon = require("../../models/couponModel");
const UserCoupon = require("../../models/userCouponModel");
const mongoose = require("mongoose");
const Cart = require("../../models/cartModel");
const cartService = require("../../utils/services/cartService");
const User = require("../../models/userModel");

// Get coupons available to a user

const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Fetch user to determine if they are a new joiner
    const user = await User.findById(userId).select("createdAt");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isNewUser =
      user.createdAt &&
      new Date(user.createdAt) > new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); 

    // Define coupon query based on user type
    const couponQuery = {
      $or: [
        { customerType: "all" },
        { customerType: isNewUser ? "new" : "existing" },
      ],
    };

    // Fetch all eligible coupons
    const coupons = await Coupon.find(couponQuery)
      .populate("applicableCategories", "name")
      .populate("applicableProducts", "name")
      .lean();

    // Fetch user coupon usage
    const userCoupons = await UserCoupon.find({ userId }).lean();
    const userCouponMap = new Map(
      userCoupons.map((uc) => [uc.couponId.toString(), uc])
    );

    // Process coupons to determine status and eligibility
    const processedCoupons = coupons.map((coupon) => {
      const userCoupon = userCouponMap.get(coupon._id.toString());
      const appliedCount = userCoupon ? userCoupon.appliedCount : 0;

      // Check if coupon is used (per-user limit)
      const isUsed = coupon.maxUsagePerUser
        ? appliedCount >= coupon.maxUsagePerUser
        : false;

      // Check if coupon is expired
      const isExpired = new Date(coupon.expiryDate) < now;

      // Determine status
      let status = coupon.status;
      if (coupon.status === "inactive") {
        status = "inactive";
      } else if (isExpired) {
        status = "expired";
      } else if (isUsed) {
        status = "used";
      } else if (coupon.totalAppliedCount >= coupon.usageLimit) {
        status = "exhausted"; // Global usage limit reached
      }

      return {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountType === "flat" ? coupon.discountValue : undefined,
        discountPercentage: coupon.discountType === "percentage" ? coupon.discountPercentage : undefined,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscountAmount: coupon.maxDiscountAmount || undefined,
        expiryDate: coupon.expiryDate,
        validFrom: coupon.validFrom,
        description: coupon.description,
        customerType: coupon.customerType,
        applicableCategories: coupon.applicableCategories,
        applicableProducts: coupon.applicableProducts,
        status,
        isUsed,
        isExpired,
        appliedCount,
        usageLimit: coupon.usageLimit,
        maxUsagePerUser: coupon.maxUsagePerUser,
      };
    });

    // Filter out ineligible coupons (e.g., inactive or not yet valid)
    const eligibleCoupons = processedCoupons.filter(
      (coupon) =>
        coupon.status !== "inactive" && new Date(coupon.validFrom) <= now
    );

    console.log(
      "@###################### userCoupons:",
      eligibleCoupons.map((c) => ({
        code: c.code,
        status: c.status,
        customerType: c.customerType,
        isExpired: c.isExpired,
        isUsed: c.isUsed,
      }))
    );

    res.status(200).json({
      success: true,
      coupons: eligibleCoupons,
    });
  } catch (error) {
    console.error("Error fetching user coupons:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching coupons.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

const applyCoupon = async (req, res) => {
  console.log("$################################")
  try {
    let { code } = req.body;
    if (typeof code === "object" && code.code) {
      code = code.code;
    }
    console.log("$################################ code", code)
    if (typeof code !== "string" || !code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required and must be a string",
      });
    }

    if (code !== code.toUpperCase()) {
      return res.status(400).json({ message: "Invalid coupon code." });
    }

    const userId = req.user.id;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      console.log("$################################ User not found")
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch cart
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "categoryId" },
    });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch coupon
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    // Check coupon status and dates
    const now = new Date();
    if (coupon.status === "inactive") {
      return res.status(400).json({ message: "Coupon is inactive" });
    }
    if (coupon.expiryDate < now) {
      coupon.status = "expired";
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }
    if (coupon.validFrom > now) {
      return res.status(400).json({ message: "Coupon is not yet valid" });
    }
    if (coupon.status !== "active") {
      return res.status(400).json({ message: `Coupon is ${coupon.status}` });
    }

    // Check usage limit
    if (coupon.totalAppliedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    // Customer type check
    if (coupon.customerType) {
      const isNewUser =
        !user.createdAt ||
        new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (coupon.customerType === "new" && !isNewUser) {
        return res.status(400).json({ message: "Coupon is only for new users" });
      }
      if (coupon.customerType === "existing" && isNewUser) {
        return res.status(400).json({ message: "Coupon is only for existing users" });
      }
    }

    // Max usage per user check
    if (coupon.maxUsagePerUser) {
      const userCouponUsage = await Cart.find({
        userId,
        couponCode: code,
        status: { $ne: "cancelled" },
      }).countDocuments();
      if (userCouponUsage >= coupon.maxUsagePerUser) {
        return res.status(400).json({ message: "Maximum coupon usage per user reached" });
      }
    }

    // Validate cart items against coupon restrictions
    const eligibleItems = cart.items.filter((item) => {
      const product = item.productId;
      if (!product || !product.categoryId) {
        return false;
      }
      if (!product.isListed || !product.categoryId.isListed) {
        return false;
      }
      const appliesToProduct =
        coupon.applicableProducts.length === 0 ||
        coupon.applicableProducts.some((id) => id.toString() === product._id.toString());
      const appliesToCategory =
        coupon.applicableCategories.length === 0 ||
        coupon.applicableCategories.some((id) => id.toString() === product.categoryId._id.toString());
      return appliesToProduct && appliesToCategory;
    });

    if (eligibleItems.length === 0) {
      return res.status(400).json({
        message: "Coupon not applicable to any items in the cart",
      });
    }

    // Calculate subtotal for eligible items
    const subtotal = roundToTwo(
      eligibleItems.reduce((sum, item) => {
        const product = item.productId;
        const price = product.discountedPrice || product.price;
        return sum + price * item.quantity;
      }, 0)
    );

    console.log("#@@@@@@@@@2222 subtotal", subtotal)
    // Check minimum purchase amount
    if (subtotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} not met`,
      });
    }

    // Calculate coupon discount
    let discount = 0;
    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discount = (coupon.discountPercentage / 100) * subtotal;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    }

    // Return coupon data without modifying cart
    return res.status(200).json({
      success: true,
      message: "Coupon validated successfully",
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discount: roundToTwo(discount),
        discountPercentage: coupon.discountPercentage || 0,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscountAmount: coupon.maxDiscountAmount || 0,
      },
    });
  } catch (error) {
    console.error("Error in applyCouponController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getUserCoupons,
  applyCoupon,
  // removeCoupon,
};
