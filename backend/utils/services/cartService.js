const mongoose = require("mongoose");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Wishlist = require("../../models/wishlistModel");
const Coupon = require("../../models/couponModel");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Order = require("../../models/OrderModel");
const Offer = require("../../models/offerModel");

const dotenv = require("dotenv");
dotenv.config();

const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

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


const validateCoupon = async (couponCode, cart, userId = null, incrementUsage = false) => {
  try {
    if (!couponCode) {
      return { valid: false, message: 'No coupon code provided', coupon: null };
    }
    if (!cart?.items?.length) {
      return { valid: false, message: 'Cart is empty', coupon: null };
    }

    if (couponCode !== couponCode?.toUpperCase()) {
      return {
        valid: false,
        message: 'Invalid coupon code. Code must be uppercase.',
        coupon: null,
      };
    }

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
        new Date(user.createdAt) > new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
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

    // Populate cart items with product data
    await cart.populate({
      path: 'items.productId',
      select: '_id price discount discountedPrice isListed colors',
    });
    
    const subtotal = roundToTwo(
      await cart.items.reduce(async (sumPromise, item) => {
        const sum = await sumPromise; 
        const product = item.productId;
        if (!product || !item.inStock) return sum;
    
        const { discountedPrice } = await applyOffers(product._id, product.price); 
        return sum + discountedPrice * item.quantity;
      }, Promise.resolve(0)) 
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
      discount = couponDoc.discountValue || 0;
    } else if (couponDoc.discountType === 'percentage') {
      discount = (couponDoc.discountPercentage / 100) * subtotal;
      if (couponDoc.maxDiscountAmount && discount > couponDoc.maxDiscountAmount) {
        discount = couponDoc.maxDiscountAmount || 0;
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
    return {
      valid: false,
      message: 'Failed to validate coupon due to an internal error',
      coupon: null,
    };
  }
};


const applyOffers = async (productId, originalPrice) => {
  try {
    const product = await Product.findById(productId).populate('categoryId');
    if (!product) {
      return { discountedPrice: originalPrice, appliedOffer: null, offerDiscount: 0 };
    }

    const basePrice = product.discount > 0 ? product.discountedPrice : product.price;
    let bestDiscount = 0;
    let appliedOffer = null;

    // Check product-specific offers
    const productOffers = await Offer.find({
      targetType: 'Product',
      targetId: productId,
      status: 'active',
      validFrom: { $lte: new Date() },
      expiryDate: { $gte: new Date() },
    });

    for (const offer of productOffers) {
      const discount = Math.min(
        basePrice * (offer.discountValue / 100),
        offer.maxDiscountAmount || Infinity
      );
      if (discount > bestDiscount) {
        bestDiscount = discount;
        appliedOffer = offer._id;
      }
    }

    // Check category-specific offers
    const categoryOffers = await Offer.find({
      targetType: 'Category',
      targetId: product.categoryId,
      status: 'active',
      validFrom: { $lte: new Date() },
      expiryDate: { $gte: new Date() },
    });

    for (const offer of categoryOffers) {
      const discount = Math.min(
        basePrice * (offer.discountValue / 100),
        offer.maxDiscountAmount || Infinity
      );
      if (discount > bestDiscount) {
        bestDiscount = discount;
        appliedOffer = offer._id;
      }
    }

    return {
      discountedPrice: basePrice - bestDiscount,
      appliedOffer,
      offerDiscount: bestDiscount,
    };
  } catch (error) {
    return { discountedPrice: originalPrice, appliedOffer: null, offerDiscount: 0 };
  }
};

const recalculateCartTotals = async (cart, coupon = null) => {
  try {
    if (!cart?.items?.length) {
      return {
        ...cart.toObject(),
        totalItems: 0,
        totalMRP: 0,
        productsDiscount: 0,
        offerDiscount: 0,
        deliveryCharge: 0,
        totalAmount: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      };
    }

    await cart.populate('items.productId');

    const totals = await Promise.all(
      cart.items
        .filter((item) => item.inStock)
        .map(async (item) => {
          const product = item.productId;

          if (!product) return { totalItems: 0, totalMRP: 0, productsDiscount: 0, offerDiscount: 0 };

          const originalPrice = product.price || 0;
          const basePrice = product.discount > 0 ? product.discountedPrice : product.price;

          const productDiscount = product.discount > 0 ? originalPrice - basePrice : 0;
          const { discountedPrice, appliedOffer, offerDiscount } = await applyOffers(product._id, basePrice);

          const totalProductDiscount = productDiscount * item.quantity;
          const totalOfferDiscount = offerDiscount * item.quantity;

          if (appliedOffer) {
            product.offerId = appliedOffer;
            await product.save();
          }

          return {
            totalItems: item.quantity,
            totalMRP: originalPrice * item.quantity,
            productsDiscount: totalProductDiscount,
            offerDiscount: totalOfferDiscount,
          };
        })
    );

    const aggregatedTotals = totals.reduce(
      (acc, curr) => ({
        totalItems: acc.totalItems + curr.totalItems,
        totalMRP: acc.totalMRP + curr.totalMRP,
        productsDiscount: acc.productsDiscount + curr.productsDiscount,
        offerDiscount: acc.offerDiscount + curr.offerDiscount,
      }),
      { totalItems: 0, totalMRP: 0, productsDiscount: 0, offerDiscount: 0 }
    );

    let couponDiscount = 0;
    let couponId = null;
    let couponCode = null;
    let discountPercentage = 0;
    if (coupon) {
      couponDiscount = coupon.discount || 0;
      couponId = coupon._id || null;
      couponCode = coupon.code || null;
      discountPercentage = coupon.discountPercentage || 0;
    }

    const subtotal = roundToTwo(
      aggregatedTotals.totalMRP - aggregatedTotals.productsDiscount - aggregatedTotals.offerDiscount
    );

    const deliveryCharge = subtotal >= (process.env.THRESHOLD_AMOUNT || 500) ? 0 : 60;

    const totalAmount = roundToTwo(Math.max(subtotal - couponDiscount + deliveryCharge, 0));

    const updatedCart = {
      ...cart.toObject(),
      totalItems: aggregatedTotals.totalItems,
      totalMRP: roundToTwo(aggregatedTotals.totalMRP),
      productsDiscount: roundToTwo(aggregatedTotals.productsDiscount),
      offerDiscount: roundToTwo(aggregatedTotals.offerDiscount),
      couponDiscount: roundToTwo(couponDiscount),
      couponId,
      couponCode,
      discountPercentage,
      deliveryCharge: roundToTwo(deliveryCharge),
      totalAmount: roundToTwo(totalAmount),
    };

    return updatedCart;
  } catch (error) {
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
};


module.exports = {
  checkStock,
  validateCoupon,
  applyOffers,
  recalculateCartTotals,
  checkAndRemoveFromCart,
};
