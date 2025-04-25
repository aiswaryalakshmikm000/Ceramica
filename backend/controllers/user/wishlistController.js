const Wishlist = require("../../models/wishlistModel");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const {
  checkStock,
} = require("../../utils/services/cartService");

const toggleWishlistItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, color } = req.body;

    const user = await User.findById(userId);
    if (!user || user.isBlocked) {
      return res.status(403).json({ message: "User is blocked or not found" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isListed) {
      return res.status(404).json({ message: "Product not found or not listed" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId && item.color === color.toLowerCase()
    );

    const isInStock = await checkStock(productId, color, 1);
    if (!isInStock && itemIndex === -1) {
      return res.status(400).json({ message: "Selected color variant is out of stock" });
    }

    const colorData = product.colors.find((c) => c.name.toLowerCase() === color.toLowerCase());
    const image = colorData?.images?.[0] || "";

    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
      return res.status(200).json({
        message: "Item removed from wishlist",
        action: "removed",
        wishlist: wishlist.items,
      });
    } else {
      wishlist.items.push({
        productId,
        color: color.toLowerCase(),
        inStock: true,
        image,
      });
      await wishlist.save();

      return res.status(200).json({
        message: "Item added to wishlist",
        action: "added",
        wishlist: wishlist.items,
      });
    }
  } catch (error) {
    console.error("EEEEEEEErrroer", error);
    return res.status(500).json({ message: error.message });
  }
};


const removeWishlistItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, color } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color.toLowerCase()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in wishlist" });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res.status(200).json({
      message: "Item removed from wishlist",
      wishlist: wishlist.items,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateWishlistItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, oldColor, newColor } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === oldColor.toLowerCase()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in wishlist" });
    }

    const isInStock = await checkStock(productId, newColor, 1);
    if (!isInStock) {
      return res.status(400).json({ success: false, message: "New color variant is out of stock" });
    }

    wishlist.items[itemIndex].color = newColor.toLowerCase();
    wishlist.items[itemIndex].discountedPrice = latestPrice;
    wishlist.items[itemIndex].inStock = true;

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist item updated successfully",
      wishlist: wishlist.items,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "name price discount color image discountedPrice",
    });

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    for (let item of wishlist.items) {
      item.inStock = await checkStock(item.productId._id, item.color, 1);
    }

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully.",
      items: wishlist.items, 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  toggleWishlistItem,
  removeWishlistItem,
  updateWishlistItem,
  getWishlist,
};