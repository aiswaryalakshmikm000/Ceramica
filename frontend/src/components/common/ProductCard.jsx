import React, { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { useFetchWishlistQuery, useToggleWishlistItemMutation } from "../../features/userAuth/userWishlistApiSlice";
import { useGetCartQuery, useAddToCartMutation } from "../../features/userAuth/userCartApislice";
import { selectUser } from "../../features/userAuth/userAuthSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// Currency formatter for INR
const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : null
  );

  const user = useSelector(selectUser);
  const userId = user?.id;

  // Get wishlist and cart data with fallback
  const { data: wishlistData = [], refetch: refetchWishlist } = useFetchWishlistQuery(userId, {
    skip: !userId, 
  });
  const { data: cart, refetch: refetchCart } = useGetCartQuery(userId, {
    skip: !userId,
  });
  
  const wishlistItems = wishlistData?.items || [];

  // Mutations
  const [toggleWishlistItem] = useToggleWishlistItemMutation();
  const [addToCart] = useAddToCartMutation();

  // Check initial states with safety checks
  const isWishlisted = wishlistItems.some(
    item => item.productId?._id === product.id && item.color === selectedColor
  );
  
  const isCartAdded = cart?.items?.some(
    item => item.productId?._id === product.id && item.color === selectedColor
  ) || false;

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); 
    if (!selectedColor || !userId) return;
    try {
      const response = await toggleWishlistItem({
        userId,
        productId: product.id,
        color: selectedColor
      }).unwrap();
      refetchWishlist();
      toast.success(response.message || "Item added to wishlist");
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error(error?.data?.message || "Failed to update wishlist");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    if (!selectedColor) return;
    try {
      const response = await addToCart({
        userId,
        productId: product.id,
        quantity: 1,
        color: selectedColor
      }).unwrap();
      refetchCart();
      toast.success(response.message || "Item added to cart")
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const handleColorSelect = (e, colorName) => {
    e.preventDefault();
    setSelectedColor(colorName);
  };

  const hasColors = product.colors && product.colors.length > 0;

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative block overflow-hidden rounded-lg aspect-square bg-ceramic-light">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        
        {product.discount > 0 && (
          <Badge variant="discount" className="absolute top-2 left-2 z-10">
            {product.discount}% OFF
          </Badge>
        )}

        {/* Action Icons - Vertical at right top */}
        <div className={`absolute top-2 right-2 flex flex-col gap-2 z-20 transition-opacity duration-500 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 ${
              !hasColors || !userId ? "opacity-60 cursor-not-allowed" : "hover:scale-110"
            }`}
            disabled={!hasColors || !userId}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 ${
              !hasColors || !userId ? "opacity-60 cursor-not-allowed" : "hover:scale-110"
            }`}
            disabled={!hasColors || !userId}
          >
            {isCartAdded ? (
              <span className="w-5 h-5 text-green-600 flex items-center justify-center">✓</span>
            ) : (
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <Link
            to={`/shop/${product.id}`}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:scale-110"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </Link>
        </div>

        {/* Color Options - At the bottom left on hover */}
        {hasColors && (
          <div className={`absolute bottom-2 left-2 z-20 transition-all duration-500 ease-in-out ${
            isHovered ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
          }`}>
            <div className="flex flex-wrap gap-2 max-w-48">
              {product.colors.map((color) => (
                <button
                  key={color._id}
                  onClick={(e) => handleColorSelect(e, color.name)}
                  className={`w-6 h-6 rounded-full border-2 relative transition-all duration-300 hover:scale-110 ${
                    selectedColor === color.name
                      ? "border-white shadow-lg"
                      : "border-transparent"
                  } ${color.stock === 0 ? "opacity-40" : "opacity-100"}`}
                  style={{ backgroundColor: color.name }}
                  title={`${color.name} (${color.stock} in stock)`}
                  disabled={color.stock === 0}
                >
                  {color.stock === 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black/60 rounded-full">
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subtle overlay on hover */}
        <div
          className={`absolute inset-0 bg-ceramic-dark/30 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      <div className="pt-4 pb-3 px-2">
        <Link to={`/shop/${product.id}`}>
          <h3 className="text-base font-medium text-ceramic-dark transition-colors duration-300 group-hover:text-ceramic-accent">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-ceramic-dark font-bold text-lg">
              {formatter.format(product.discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-ceramic-dark/50 line-through text-sm">
                {formatter.format(product.price)}
              </span>
            )}
          </div>
          {product.inStock ? (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full transition-all duration-300 hover:bg-green-100">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full transition-all duration-300 hover:bg-red-100">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;