
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import {
  useFetchWishlistQuery,
  useToggleWishlistItemMutation,
} from "../../../features/userAuth/userWishlistApiSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../../features/userAuth/userCartApislice";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import LoginPromptModal from "../../ui/LoginPromptModal";
import QuantityControl from "../../user/cart/QuantityControl";
import ColorSelector from "../../common/ColorSelector"; 
import { toast } from "react-toastify";

const ProductInfo = ({ product, onColorSelect, selectedColor }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = !!user;
  const userId = user?.id;

  const {
    data: wishlistData = [],
    isLoading: wishlistLoading,
    isError: wishlistError,
    error: wishlistErrorDetails,
    refetch: refetchWishlist,
  } = useFetchWishlistQuery(userId, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(userId, {
    skip: !isAuthenticated,
  });
  const [toggleWishlistItem] = useToggleWishlistItemMutation();
  const [addToCart] = useAddToCartMutation();

  const wishlistItems = wishlistData?.items || [];
  const isInWishlist = wishlistItems.some(
    (item) =>
      item.productId?._id === product._id && item.color === selectedColor
  );

  const cartItems = cartData?.items || [];
  const isProductInCart = cartItems.some(
    (item) => item.productId === product._id && item.color === selectedColor
  );

  const currentColorItem =
    product.colors.find((c) => c.name === selectedColor) || {};
  const currentStock = currentColorItem.stock || 0;

  const handleColorSelect = (colorName) => {
    onColorSelect(colorName);
    const newColorStock =
      product.colors.find((c) => c.name === colorName)?.stock || 0;
    if (quantity > newColorStock) {
      setQuantity(newColorStock > 0 ? 1 : 0);
    }
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast("Maximum available stock reached", {
        description: `Only ${currentStock} units available in this color.`,
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await toggleWishlistItem({
        userId,
        productId: product._id,
        color: selectedColor,
      }).unwrap();

      const updatedWishlist = response.wishlist || [];
      const newIsInWishlist = updatedWishlist.some(
        (item) =>
          item.productId?._id === product._id && item.color === selectedColor
      );

      await refetchWishlist();

      toast.success(response.message || "Wishlist updated", {
        description: `${product.name} (${selectedColor}) has been ${response.action} your wishlist.`,
      });

      refetchWishlist();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await addToCart({
        userId,
        productId: product._id,
        quantity,
        color: selectedColor,
      }).unwrap();
      toast.success(response.message || "Item successfully added to cart", {
        description: `${quantity} × ${product.name} (${selectedColor}) added to your cart.`,
      });
      setIsAddedToCart(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add item to cart");
    }
  };

  const handleGoToCart = () => {
    navigate(`/cart/${userId}`);
  };

  if (wishlistLoading || cartLoading) return <div>Loading...</div>;

  return (
    <div className="w-full lg:w-1/2 pl-0 lg:pl-8 mt-8 lg:mt-0 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-5xl font-bold text-gray-800">{product.name}</h1>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
            isInWishlist ? "text-red-500" : "text-gray-500"
          }`}
          onClick={toggleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={24} fill={isInWishlist ? "#FF3B30" : "none"} />
        </button>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl font-bold text-gray-800">
          ₹{product.discountedPrice.toFixed(2)}
        </span>
        {product.discount > 0 && (
          <span className="text-lg text-gray-500 line-through">
            ₹{product.price.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex items-center mb-6">
        <div
          className={`w-3 h-3 rounded-full ${
            currentStock > 0 ? "bg-green-500" : "bg-red-500"
          } mr-2`}
        ></div>
        <span className="text-sm text-gray-600">
          {currentStock > 0
            ? `In Stock (${currentStock} available)`
            : "Out of Stock"}
        </span>
      </div>

      {product.colors.length > 0 && (
        <ColorSelector
          colors={product.colors}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
        />
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Quantity</h3>
        <QuantityControl
          quantity={quantity}
          onIncrease={incrementQuantity}
          onDecrease={decrementQuantity}
        />
      </div>

      {(isAddedToCart || isProductInCart) && isAuthenticated ? (
        <button
          className="w-full flex items-center justify-center py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={handleGoToCart}
        >
          <ArrowRight className="mr-2" size={20} />
          Go to Cart
        </button>
      ) : (
        <button
          className="w-full flex items-center justify-center py-3 bg-orange-800/90 text-white rounded-md hover:bg-orange-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={currentStock === 0}
        >
          <ShoppingCart className="mr-2" size={20} />
          Add to Cart
        </button>
      )}

      <div className="mt-8 prose prose-sm max-w-none">
        <p className="text-gray-600 leading-relaxed">
          {product.description.length > 200
            ? `${product.description.substring(0, 200)}...`
            : product.description}
        </p>
      </div>

      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default ProductInfo;