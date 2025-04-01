// const Cart = require('../../models/cartModel');
// const Product = require("../../models/productModel")
// const cartService = require('../../utils/services/cartService');

// const addToCart = async (req, res) => {
//   try {
//       const userId = req.params.userId; // Get userId from decoded token
//       const { productId, quantity, color } = req.body;

//       // Validate input
//       if (!productId || !quantity || !color) {
//           console.log("Product ID, quantity, and color are required");
//           return res.status(400).json({ message: 'Product ID, quantity, and color are required' });
//       }

//       if (quantity < 1) {
//           console.log("Quantity must be at least 1");
//           return res.status(400).json({ message: 'Quantity must be at least 1' });
//       }

//       // Check stock
//       const inStock = await cartService.checkStock(productId, color, quantity);
//       if (!inStock) {
//           console.log("Product out of stock", inStock);
//           return res.status(400).json({ message: 'Product out of stock' });
//       }

//       const product = await Product.findById(productId);
//     if (!product || !product.isListed) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//       // Fetch latest price
//       const latestPrice = await cartService.fetchLatestPrice(productId);
//       console.log("latestPrice", latestPrice);

//       // Find or create cart
//       let cart = await Cart.findOne({ userId });
//       if (!cart) {
//           cart = new Cart({ userId, items: [] });
//       }
      

//       // Check if item already exists in cart
//       const existingItemIndex = cart.items.findIndex(
//           (item) => item.productId.toString() === productId && item.color === color
//       );

//       if (existingItemIndex > -1) {
//           // Update existing item
//           cart.items[existingItemIndex].quantity += quantity;
//           if (cart.items[existingItemIndex].quantity > cart.items[existingItemIndex].maxQtyPerUser) {
//               console.log('Maximum quantity per user exceeded');
//               return res.status(400).json({ message: 'Maximum quantity per user exceeded' });
//           }
//       } else {
//           // Add new item
//           const colorData = product.colors.find(c => c.name.toLowerCase() === color.toLowerCase());
//       cart.items.push({
//         productId,
//         name: product.name,
//         color,
//         quantity,
//         originalPrice: product.price,  // Store original price
//         latestPrice,                  // Store discounted price
//         discount: product.discount,
//         image: colorData?.images[0],  // Use first image from the color variant
//         inStock: true,
//       });
//       }

//       console.log("cart", cart);

//       // Recalculate totals
//       const updatedCart = await cartService.recalculateCartTotals(cart);
//       cart.set(updatedCart);
//       await cart.save();
//       console.log("updatd Item added to cart",updatedCart);

//       res.status(200).json({ message: 'Item added to cart', cart: updatedCart });
//   } catch (error) {
//       console.log("Error adding to cart:", error.stack); 
//       res.status(500).json({ message: 'Error adding to cart', error: error.message });
//   }
// };

// const showCart = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const originalItemCount = cart.items.length;
//     cart.items = cart.items.filter(item => {
//       const product = item.productId;
//       return product && product.isListed === true;
//     });
//     const removedItemCount = originalItemCount - cart.items.length;

//     const updatedCart = await cartService.recalculateCartTotals(cart);
//     cart.set(updatedCart);
//     await cart.save();

//     const response = { cart: updatedCart };
//     if (removedItemCount > 0) {
//       response.message = `${removedItemCount} item(s) were removed from your cart as they are no longer available.`;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error fetching cart:', error.stack);
//     res.status(500).json({ message: 'Error fetching cart', error: error.message });
//   }
// };


// const updateCart = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { productId, quantity, color } = req.body;

//         const product = await Product.findById(productId);
//     if (!product || !product.isListed) {
//       return res.status(404).json({ message: 'Product not found or unavailable' });
//     }

//         const cart = await Cart.findOne({ userId });
//         if (!cart) {
//           console.log("no cart" , cart)
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const itemIndex = cart.items.findIndex(
//             item => item.productId.toString() === productId && item.color === color
//         );

//         if (itemIndex === -1) {
//             return res.status(404).json({ message: 'Item not found in cart' });
//         }

//         if (quantity < 1) {
//             return res.status(400).json({ message: 'Quantity must be at least 1' });
//         }

//         // Check stock
//         const inStock = await cartService.checkStock(productId, color, quantity);
//         if (!inStock) {
//             return res.status(400).json({ message: 'Product out of stock' });
//         }

//         // Update quantity
//         cart.items[itemIndex].quantity = quantity;
//         if (cart.items[itemIndex].quantity > cart.items[itemIndex].maxQtyPerUser) {
//             return res.status(400).json({ message: 'Maximum quantity per user exceeded' });
//         }

//         const updatedCart = await cartService.recalculateCartTotals(cart);
//         cart.set(updatedCart);
//         await cart.save();

//         res.status(200).json({ message: 'Cart updated', cart: updatedCart });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating cart', error: error.message });
//     }
// };

// const removeItemFromCart = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { productId, color } = req.body;

//         const cart = await Cart.findOne({ userId });
//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const itemIndex = cart.items.findIndex(
//             item => item.productId.toString() === productId && item.color === color
//         );

//         if (itemIndex === -1) {
//             return res.status(404).json({ message: 'Item not found in cart' });
//         }

//         cart.items.splice(itemIndex, 1);
//         const updatedCart = await cartService.recalculateCartTotals(cart);
//         cart.set(updatedCart);
//         await cart.save();

//         res.status(200).json({ message: 'Item removed from cart', cart: updatedCart });
//     } catch (error) {
//         res.status(500).json({ message: 'Error removing item from cart', error: error.message });
//     }
// };

// module.exports = {
//     addToCart,
//     showCart,
//     updateCart,
//     removeItemFromCart,
// };


const Cart = require('../../models/cartModel');
const Product = require("../../models/productModel");
const cartService = require('../../utils/services/cartService');

const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity, color } = req.body;

    // Validate input
    if (!productId || !quantity || !color) {
      console.log("Product ID, quantity, and color are required");
      return res.status(400).json({ success: false, message: 'Product ID, quantity, and color are required' });
    }

    if (quantity < 1) {
      console.log("Quantity must be at least 1");
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Check stock
    const inStock = await cartService.checkStock(productId, color, quantity);
    if (!inStock) {
      console.log("Product out of stock", inStock);
      return res.status(400).json({ success: false, message: 'Product is currently out of stock' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isListed) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    // Fetch latest price
    const latestPrice = await cartService.fetchLatestPrice(productId);
    console.log("latestPrice", latestPrice);

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
        console.log('Maximum quantity per user exceeded');
        return res.status(400).json({ success: false, message: 'Maximum quantity per user exceeded' });
      }
    } else {
      // Add new item
      const colorData = product.colors.find(c => c.name.toLowerCase() === color.toLowerCase());
      cart.items.push({
        productId,
        name: product.name,
        color,
        quantity,
        originalPrice: product.price,
        latestPrice,
        discount: product.discount,
        image: colorData?.images[0],
        inStock: true,
      });
    }

    console.log("cart", cart);

    // Recalculate totals
    const updatedCart = await cartService.recalculateCartTotals(cart);
    cart.set(updatedCart);
    await cart.save();
    console.log("updated Item added to cart", updatedCart);

    res.status(200).json({ 
      success: true, 
      message: existingItemIndex > -1 ? 'Item quantity updated in cart' : 'Item successfully added to cart', 
      cart: updatedCart 
    });
  } catch (error) {
    console.log("Error adding to cart:", error.stack);
    res.status(500).json({ success: false, message: 'Failed to add item to cart', error: error.message });
  }
};

const showCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    const originalItemCount = cart.items.length;
    cart.items = cart.items.filter(item => {
      const product = item.productId;
      return product && product.isListed === true;
    });
    const removedItemCount = originalItemCount - cart.items.length;

    const updatedCart = await cartService.recalculateCartTotals(cart);
    cart.set(updatedCart);
    await cart.save();

    const response = { 
      success: true,
      cart: updatedCart 
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
      console.log("no cart", cart);
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

module.exports = {
  addToCart,
  showCart,
  updateCart,
  removeItemFromCart,
};