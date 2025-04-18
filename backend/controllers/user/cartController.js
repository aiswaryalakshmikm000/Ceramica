
const Cart = require('../../models/cartModel');
const Product = require("../../models/productModel");
const cartService = require('../../utils/services/cartService');

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity, color } = req.body;

    if (!productId || !quantity || !color) {
      return res.status(400).json({ success: false, message: 'Product ID, quantity, and color are required' });
    }
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Check stock
    const inStock = await cartService.checkStock(productId, color, quantity);
    if (!inStock) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isListed) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.color === color
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      if (cart.items[existingItemIndex].quantity > cart.items[existingItemIndex].maxQtyPerUser) {
        return res.status(400).json({ success: false, message: 'Maximum quantity per user exceeded' });
      }
    } else {
      // Add new item
      const colorData = product.colors.find((c) => c.name.toLowerCase() === color.toLowerCase());
      if (quantity > 5) {
        return res.status(400).json({ success: false, message: 'Maximum quantity per user exceeded' });
      }
      cart.items.push({
        productId,
        color,
        quantity,
        image: colorData?.images[0],
        inStock: true,
      });
    }

    // Recalculate totals
    const updatedCart = await cartService.recalculateCartTotals(cart);
    cart.set(updatedCart);
    await cart.save();

    // Remove from wishlist after successful cart addition
    await cartService.checkAndRemoveFromCart(userId, productId, color);

    res.status(200).json({
      success: true,
      message: existingItemIndex > -1 ? 'Item quantity updated in cart' : 'Item successfully added to cart',
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: 'Failed to add item to cart', error: error.message });
  }
};

const showCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
    .populate({
      path: 'items.productId', 
      select: '_id name price discount discountedPrice isListed colors',
      populate: {
        path: 'categoryId',
        model: 'Category',
        select: 'isListed',
      }
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    const originalItemCount = cart.items.length;
    
    cart.items = cart.items.filter(item => {
      const product = item.productId;
      return  product && 
              product.isListed === true && 
              product.categoryId && 
              product.categoryId.isListed === true;;
    });

    const removedItemCount = originalItemCount - cart.items.length;

    const updatedCart = await cartService.recalculateCartTotals(cart);

    if (removedItemCount > 0) {
    cart.set(updatedCart);
    await cart.save();
    }

    const response = { 
      success: true,
      cart: {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items.map((item) => ({
          ...item.toObject(),
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            discount: item.productId.discount,
            discountedPrice: item.productId.discountedPrice,
            isListed: item.productId.isListed,
            colors: item.productId.colors,
          },
        })),
        // platformFee: updatedCart.platformFee || 3,
        totalItems: updatedCart.totalItems,
        totalMRP: updatedCart.totalMRP,
        totalDiscount: updatedCart.totalDiscount,
        deliveryCharge: updatedCart.deliveryCharge,
        totalAmount: updatedCart.totalAmount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      }, 
    };
    
    if (removedItemCount > 0) {
      response.message = `${removedItemCount} item(s) were removed from your cart as they are no longer available`;
    } else {
      response.message = 'Cart retrieved successfully';
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching cart:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to retrieve cart', error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, color } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isListed) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Check stock
    const inStock = await cartService.checkStock(productId, color, quantity);
    if (!inStock) {
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    if (cart.items[itemIndex].quantity > cart.items[itemIndex].maxQtyPerUser) {
      return res.status(400).json({ success: false, message: 'Maximum quantity per user exceeded' });
    }

    const updatedCart = await cartService.recalculateCartTotals(cart);
    cart.set(updatedCart);
    await cart.save();

    res.status(200).json({ 
      success: true, 
      message: 'Cart item quantity updated successfully', 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart', error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, color } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    const updatedCart = await cartService.recalculateCartTotals(cart);
    cart.set(updatedCart);
    await cart.save();

    res.status(200).json({ 
      success: true, 
      message: 'Item successfully removed from cart', 
      cart: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: error.message });
  }
};


// checkoutValidation.js
const checkoutValidation = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
        data: null,
      });
    }

    const issues = {
      outOfStockItems: [],
      unlistedItems: [],
    };

    for (const item of cart.items) {
      const product = item.productId;

      if (!product || !product.isListed) {
        issues.unlistedItems.push({
          productId: item.productId.toString(),
          name: item.name,
          color: item.color,
        });
        continue;
      }

      const isInStock = await cartService.checkStock(item.productId, item.color, item.quantity);
      if (!isInStock) {
        issues.outOfStockItems.push({
          productId: item.productId.toString(),
          name: item.name,
          color: item.color,
        });
      }
    }

    if (issues.outOfStockItems.length > 0 || issues.unlistedItems.length > 0) {
      let message = '';
      if (issues.outOfStockItems.length > 0) {
        message += 'Some items are out of stock. ';
      }
      if (issues.unlistedItems.length > 0) {
        message += 'Some items are no longer available. ';
      }
      message += 'Please remove them from your cart to proceed to checkout.';

      return res.status(400).json({
        success: false,
        message,
        data: issues,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart is ready for checkout',
      data: null,
    });
  } catch (error) {
    console.error('Error in checkout validation:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart for checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  addToCart,
  showCart,
  updateCart,
  removeItemFromCart,
  checkoutValidation
};