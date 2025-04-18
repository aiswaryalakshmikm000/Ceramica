const mongoose = require("mongoose");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Wishlist = require("../../models/wishlistModel");
const Coupon = require("../../models/couponModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Order = require("../../models/OrderModel");

const dotenv = require("dotenv");
dotenv.config();

// Round to two decimal places
const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

// Calculate discount price
const calculateDiscountPrice = (product) => {
  if (!product) return 0;
  let totalDiscount = product.discount || 0;
  return Math.min(totalDiscount, 100);
};


// Check stock availability
const checkStock = async (productId, color, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    return false;
  }

  const colorData = product.colors.find(
    (c) => c.name.toLowerCase() === color.toLowerCase()
  );
  if (!colorData) {
    console.log(`Color ${color} not found in product`);
    return false;
  }

  const availableStock = colorData.stock;
  console.log(
    `Checking stock for ${color}: ${availableStock} vs requested ${quantity}`
  );
  return availableStock >= quantity;
};

const recalculateCartTotals = async (cart, coupon = null) => {
  try {
    if (!cart?.items?.length) {
      return {
        ...cart.toObject(),
        totalItems: 0,
        totalMRP: 0,
        totalDiscount: 0,
        deliveryCharge: 0,
        totalAmount: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      };
    }

    // Populate product data
    await cart.populate("items.productId");

    const totals = cart.items
      .filter((item) => item.inStock)
      .reduce(
        (acc, item) => {
          const product = item.productId;
          if (!product) return acc;
          const originalPrice = product.price || 0;
          const discountedPrice = product.discountedPrice || originalPrice;
          const discountAmount = (originalPrice - discountedPrice) * item.quantity;

          return {
            totalItems: acc.totalItems + item.quantity,
            totalMRP: acc.totalMRP + originalPrice * item.quantity,
            totalDiscount: acc.totalDiscount + discountAmount,
          };
        },
        { totalItems: 0, totalMRP: 0, totalDiscount: 0 }
      );

    let couponDiscount = 0;
    let couponId = null;
    let discountPercentage = 0;
    if (coupon) {
      couponDiscount = coupon.discount || 0;
      couponId = coupon._id || null;
      discountPercentage = coupon.discountPercentage || 0;
    }

    const subtotal = Math.max(totals.totalMRP - totals.totalDiscount, 0);
    const deliveryCharge =
      subtotal >= (process.env.THRESHOLD_AMOUNT || 500) ? 0 : 60;

    const totalAmount = Math.max(
      subtotal - couponDiscount + deliveryCharge,
      0
    );

    const updatedCart = {
      ...cart.toObject(),
      totalItems: totals.totalItems,
      totalMRP: roundToTwo(totals.totalMRP),
      totalDiscount: roundToTwo(totals.totalDiscount),
      couponDiscount: roundToTwo(couponDiscount),
      couponId,
      discountPercentage,
      deliveryCharge: roundToTwo(deliveryCharge),
      totalAmount: roundToTwo(totalAmount),
    };

    console.log("# recalculateCartTotals result:", updatedCart);
    return updatedCart;
  } catch (error) {
    console.error("Error in recalculateCartTotals:", error);
    throw error;
  }
};

// Helper function
const checkAndRemoveFromCart = async (userId, productId, color) => {
  let removedFromWishlist = false;
  const wishlist = await Wishlist.findOne({ userId });
  if (wishlist) {
    const itemIndex = wishlist.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color.toLowerCase()
    );
    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
      removedFromWishlist = true;
    }
  }
  {
  }
};

const validateCoupon = async (couponCode, cart, userId = null, incrementUsage = false) => {
  try {
    // Validate inputs
    if (!couponCode) {
      return { valid: false, message: 'No coupon code provided', coupon: null };
    }
    if (!cart?.items?.length) {
      return { valid: false, message: 'Cart is empty', coupon: null };
    }

    // Validate coupon code format (must be uppercase)
    if (couponCode !== couponCode.toUpperCase()) {
      return {
        valid: false,
        message: 'Invalid coupon code. Code must be uppercase.',
        coupon: null,
      };
    }

    // Fetch coupon
    const couponDoc = await Coupon.findOne({ code: couponCode });
    if (!couponDoc) {
      return { valid: false, message: 'Invalid coupon code', coupon: null };
    }

    // Check coupon status and dates
    const now = new Date();
    if (couponDoc.status === 'inactive') {
      return { valid: false, message: 'Coupon is inactive', coupon: null };
    }
    if (couponDoc.expiryDate < now) {
      couponDoc.status = 'expired';
      await couponDoc.save();
      return { valid: false, message: 'Coupon has expired', coupon: null };
    }
    if (couponDoc.validFrom > now) {
      return { valid: false, message: 'Coupon is not yet valid', coupon: null };
    }
    if (couponDoc.status !== 'active') {
      return { valid: false, message: `Coupon is ${couponDoc.status}`, coupon: null };
    }

    // Check usage limit
    if (couponDoc.totalAppliedCount >= couponDoc.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached', coupon: null };
    }

    // Customer type check (if userId is provided)
    if (userId && couponDoc.customerType) {
      const user = await User.findById(userId);
      if (!user) {
        return { valid: false, message: 'User not found', coupon: null };
      }
      const isNewUser =
        !user.createdAt ||
        new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (couponDoc.customerType === 'new' && !isNewUser) {
        return { valid: false, message: 'Coupon is only for new users', coupon: null };
      }
      if (couponDoc.customerType === 'existing' && isNewUser) {
        return { valid: false, message: 'Coupon is only for existing users', coupon: null };
      }
    }

    // Max usage per user check (if userId is provided)
    if (userId && couponDoc.maxUsagePerUser) {
      const userCouponUsage = await Order.find({
        userId,
        couponCode,
        status: { $ne: 'Cancelled' },
      }).countDocuments();
      if (userCouponUsage >= couponDoc.maxUsagePerUser) {
        return {
          valid: false,
          message: 'Maximum coupon usage per user reached',
          coupon: null,
        };
      }
    }

    // Populate cart items with product and category data
    await cart.populate({
      path: 'items.productId',
      populate: { path: 'categoryId' },
    });

    // Validate cart items against coupon restrictions
    const eligibleItems = cart.items.filter((item) => {
      const product = item.productId;
      if (!product || !product.categoryId) return false;
      if (!product.isListed || !product.categoryId.isListed) return false;
      const appliesToProduct =
        couponDoc.applicableProducts.length === 0 ||
        couponDoc.applicableProducts.some((id) => id.toString() === product._id.toString());
      const appliesToCategory =
        couponDoc.applicableCategories.length === 0 ||
        couponDoc.applicableCategories.some((id) => id.toString() === product.categoryId._id.toString());
      return appliesToProduct && appliesToCategory;
    });

    if (eligibleItems.length === 0) {
      return {
        valid: false,
        message: 'Coupon not applicable to any items in the cart',
        coupon: null,
      };
    }

    // Calculate subtotal for eligible items
    const subtotal = roundToTwo(
      eligibleItems.reduce((sum, item) => {
        const product = item.productId;
        const price = product.discountedPrice || product.price;
        return sum + price * item.quantity;
      }, 0)
    );

    // Check minimum purchase amount
    if (subtotal < couponDoc.minPurchaseAmount) {
      return {
        valid: false,
        message: `Minimum purchase amount of ₹${couponDoc.minPurchaseAmount} not met`,
        coupon: null,
      };
    }

    // Calculate coupon discount
    let discount = 0;
    if (couponDoc.discountType === 'flat') {
      discount = couponDoc.discountValue;
    } else if (couponDoc.discountType === 'percentage') {
      discount = (couponDoc.discountPercentage / 100) * subtotal;
      if (couponDoc.maxDiscountAmount && discount > couponDoc.maxDiscountAmount) {
        discount = couponDoc.maxDiscountAmount;
      }
    }
    discount = roundToTwo(discount);

    // Increment usage if requested (e.g., for confirmed orders)
    if (incrementUsage) {
      couponDoc.totalAppliedCount += 1;
      await couponDoc.save();
    }

    // Return validated coupon data
    const validatedCoupon = {
      _id: couponDoc._id,
      code: couponDoc.code,
      discountType: couponDoc.discountType,
      discount,
      discountPercentage: couponDoc.discountPercentage || 0,
      minPurchaseAmount: couponDoc.minPurchaseAmount,
      maxDiscountAmount: couponDoc.maxDiscountAmount || 0,
    };

    return {
      valid: true,
      message: 'Coupon validated successfully',
      coupon: validatedCoupon,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      message: 'Failed to validate coupon due to an internal error',
      coupon: null,
    };
  }
};


module.exports = {
  calculateDiscountPrice,
  checkStock,
  recalculateCartTotals,
  checkAndRemoveFromCart,
  validateCoupon,
  
};
