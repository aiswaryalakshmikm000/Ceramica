
const mongoose = require("mongoose");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const Wishlist = require("../../models/wishlistModel");

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

// Recalculate cart totals
const recalculateCartTotals = async (cart) => {
    try {
      if (!cart.items || cart.items.length === 0) {
        return {
          ...cart.toObject(),
          totalItems: 0,
          totalMRP: 0,
          totalDiscount: 0,
          deliveryCharge: 0,
          totalAmount: 0,
        };
      }
  
      // Populate product data for all items
      await cart.populate('items.productId');
  
      const totals = cart.items
        .filter((item) => item.inStock === true) // Only consider in-stock items
        .reduce(
          (acc, item) => {
            const product = item.productId; // Populated product object
            const originalPrice = product.price || 0;
            const discountedPrice = product.discountedPrice || originalPrice;
            const discountAmount = (originalPrice - discountedPrice) * item.quantity;
  
            console.log(`Item: ${item.productId}, Original: ${originalPrice}, Discounted: ${discountedPrice}, Qty: ${item.quantity}`);
  
            return {
              totalItems: acc.totalItems + item.quantity,
              totalMRP: acc.totalMRP + (originalPrice * item.quantity),
              totalDiscount: acc.totalDiscount + discountAmount,
            };
          },
          { totalItems: 0, totalMRP: 0, totalDiscount: 0 }
        );
  
      const calculateDeliveryCharge = () => {
        const totalAmount = totals.totalMRP - totals.totalDiscount + (cart.platformFee || 0);
        console.log("Calculating delivery charge, totalAmount before delivery:", totalAmount);
        return totalAmount >= (process.env.THRESHOLD_AMOUNT || 500) ? 0 : 60;
      };
  
      const deliveryCharge = calculateDeliveryCharge();
  
      console.log("Totals before final calculation:", totals);
      console.log("Delivery Charge:", deliveryCharge);
  
      return {
        ...cart.toObject(),
        totalItems: totals.totalItems,
        totalMRP: roundToTwo(Math.max(totals.totalMRP, 0)),
        totalDiscount: roundToTwo(Math.max(totals.totalDiscount, 0)),
        deliveryCharge,
        totalAmount: roundToTwo(
          Math.max(0, totals.totalMRP - totals.totalDiscount + (cart.platformFee || 0) + deliveryCharge)
        ),
      };
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

module.exports = {
  calculateDiscountPrice,
  checkStock,
  recalculateCartTotals,
  checkAndRemoveFromCart,
};
