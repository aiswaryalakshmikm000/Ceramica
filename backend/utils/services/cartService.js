
const mongoose = require('mongoose');
const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');
const Wishlist = require('../../models/wishlistModel');

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
        console.log("Product not found");
        return false;
    }

    const colorData = product.colors.find((c) => c.name.toLowerCase() === color.toLowerCase());
    if (!colorData) {
        console.log(`Color ${color} not found in product`);
        return false;
    }

    const availableStock = colorData.stock;
    console.log(`Checking stock for ${color}: ${availableStock} vs requested ${quantity}`);
    return availableStock >= quantity;
};

// Fetch latest price
const fetchLatestPrice = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product not found for price fetch");
        return 0;
    }
    return product.discountedPrice; 
};

// Recalculate cart totals
const recalculateCartTotals = (cart) => {
    try {

        const totals = cart.items
            .filter((item) => item.inStock === true)
            .reduce(
                (acc, item) => {
                    const originalPrice = item.originalPrice || 0;
                    const discountedPrice = item.latestPrice || 0;
                    const discountPercent = Number(item.discount) || 0;
                    
                    // Calculate discount amount per item
                    const itemDiscountAmount = discountPercent > 0 
                        ? (originalPrice * (discountPercent / 100)) * item.quantity
                        : (originalPrice - discountedPrice) * item.quantity;

                    console.log(`Item calculation: 
                        originalPrice=${originalPrice}, 
                        discountedPrice=${discountedPrice}, 
                        discountPercent=${discountPercent}, 
                        quantity=${item.quantity}, 
                        itemDiscountAmount=${itemDiscountAmount}`);

                    return {
                        totalItems: acc.totalItems + (item.quantity || 0),
                        totalMRP: acc.totalMRP + (originalPrice * (item.quantity || 0)),
                        totalDiscount: acc.totalDiscount + itemDiscountAmount,
                    };
                },
                { totalItems: 0, totalMRP: 0, totalDiscount: 0 }
            );

        const calculateDeliveryCharge = () => {
            const totalAmount = totals.totalMRP - totals.totalDiscount + (cart.platformFee || 0);
            return totalAmount >= (process.env.THRESHOLD_AMOUNT || 500) ? 0 : 60;
        };

        const deliveryCharge = calculateDeliveryCharge();

        console.log("deliveryCharge", deliveryCharge)

        return {
            ...cart.toObject(),
            totalItems: totals.totalItems,
            totalMRP: roundToTwo(Math.max(totals.totalMRP, 0)),
            totalDiscount: roundToTwo(Math.max(totals.totalDiscount, 0)),
            deliveryCharge,
            totalAmount: roundToTwo(
                Math.max(
                    0,
                    totals.totalMRP - totals.totalDiscount + (cart.platformFee || 0) + deliveryCharge
                )
            ),
        };
    } catch (error) {
        console.log("Error in recalculateCartTotals:", error.stack);
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
    fetchLatestPrice,
    recalculateCartTotals,
    checkAndRemoveFromCart,
};