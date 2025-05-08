const Coupon = require("../../models/couponModel");
const UserCoupon = require("../../models/userCouponModel");
const mongoose = require("mongoose");
const Cart = require("../../models/cartModel");
const User = require("../../models/userModel");

const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const user = await User.findById(userId).select("createdAt totalReferrals referredBy");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isNewUser =
      user.createdAt &&
      new Date(user.createdAt) > new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)&&
      user.totalReferrals === 0;

    const couponQuery = {
      $or: [
        { customerType: "all" , userId: null},
        { customerType: isNewUser ? "new" : "existing" , userId: null},
        {userId: new mongoose.Types.ObjectId(userId)}
      ],
      status: "active",
      validFrom: { $lte: now },
      expiryDate: { $gte: now },
    };

    const coupons = await Coupon.find(couponQuery).lean();

    const userCoupons = await UserCoupon.find({ userId }).lean();
    const userCouponMap = new Map(
      userCoupons.map((uc) => [uc.couponId.toString(), uc])
    );

    const processedCoupons = coupons.map((coupon) => {
      const userCoupon = userCouponMap.get(coupon._id.toString());
      const appliedCount = userCoupon ? userCoupon.appliedCount : 0;

      const isUsed = coupon.maxUsagePerUser
        ? appliedCount >= coupon.maxUsagePerUser
        : false;

      const isExpired = new Date(coupon.expiryDate) < now;

      let status = coupon.status;
      if (coupon.status === "inactive") {
        status = "inactive";
      } else if (isExpired) {
        status = "expired";
      } else if (isUsed) {
        status = "used";
      } else if (coupon.totalAppliedCount >= coupon.usageLimit) {
        status = "exhausted";
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
        status,
        isUsed,
        isExpired,
        appliedCount,
        usageLimit: coupon.usageLimit,
        maxUsagePerUser: coupon.maxUsagePerUser,
      };
    });

    const eligibleCoupons = processedCoupons.filter(
      (coupon) =>
        coupon.status !== "inactive" && new Date(coupon.validFrom) <= now && (!coupon.userId || coupon.userId.toString() === userId)
    );
    
    res.status(200).json({
      success: true,
      coupons: eligibleCoupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching coupons.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


const applyCoupon = async (req, res) => {
  try {
    let { code } = req.body;
    if (typeof code === "object" && code.code) {
      code = code.code;
    }
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

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

    if (coupon.totalAppliedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (coupon.customerType && coupon.customerType !== "all") {
      const isNewUser =
        !user.createdAt ||
        new Date(user.createdAt) > new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      if (coupon.customerType === "new" && !isNewUser) {
        return res.status(400).json({ message: "Coupon is only for new users" });
      }
      if (coupon.customerType === "existing" && isNewUser) {
        return res.status(400).json({ message: "Coupon is only for existing users" });
      }
    }

    if (coupon.maxUsagePerUser) {
      const userCoupon = await UserCoupon.findOne({ userId, couponId: coupon._id });
      const appliedCount = userCoupon ? userCoupon.appliedCount : 0;
      if (appliedCount >= coupon.maxUsagePerUser) {
        return res.status(400).json({ message: "Maximum coupon usage per user reached" });
      }
    }

    const subtotal = roundToTwo(
      cart.items.reduce((sum, item) => {
        const product = item.productId;
        if (!product || !item.inStock) return sum;
        const price = product.discountedPrice || product.price;
        return sum + price * item.quantity;
      }, 0)
    );

    if (subtotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of ₹${coupon.minPurchaseAmount} not met`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discount = (coupon.discountPercentage / 100) * subtotal;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    }
    discount = roundToTwo(discount);

    return res.status(200).json({
      success: true,
      message: "Coupon validated successfully",
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discount: discount,
        discountPercentage: coupon.discountPercentage || 0,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscountAmount: coupon.maxDiscountAmount || 0,
      },
    });
  } catch (error) {
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
};