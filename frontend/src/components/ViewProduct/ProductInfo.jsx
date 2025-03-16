import React, { useState } from 'react';
import { Heart, ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../features/products/userProductSlice';
import { toast } from 'sonner';

const ProductInfo = ({ product, onColorSelect, selectedColor }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.userProduct.wishlist);
  const isInWishlist = wishlist.includes(product._id);

  const currentColorItem = product.colors.find((c) => c.name === selectedColor) || {};
  const currentStock = currentColorItem.stock || 0;

  const handleColorSelect = (colorName) => {
    onColorSelect(colorName); // Update parent state
    const newColorStock = product.colors.find((c) => c.name === colorName)?.stock || 0;
    if (quantity > newColorStock) {
      setQuantity(newColorStock > 0 ? 1 : 0);
    }
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast('Maximum available stock reached', {
        description: `Only ${currentStock} units available in this color.`,
      });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value > currentStock) {
        setQuantity(currentStock);
        toast('Maximum available stock reached', {
          description: `Only ${currentStock} units available in this color.`,
        });
      } else if (value < 1) {
        setQuantity(1);
      } else {
        setQuantity(value);
      }
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast('Removed from wishlist', {
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      dispatch(addToWishlist(product._id));
      toast('Added to wishlist', {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    toast('Added to cart', {
      description: `${quantity} × ${product.name} (${selectedColor}) added to your cart.`,
    });
  };

  return (
    <div className="w-full lg:w-1/2 pl-0 lg:pl-8 mt-8 lg:mt-0 animate-fade-in-up">
      {/* Product Name and Wishlist */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-5xl font-bold text-gray-800">{product.name}</h1>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
            isInWishlist ? 'text-red-500' : 'text-gray-500'
          }`}
          onClick={toggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={24} fill={isInWishlist ? '#FF3B30' : 'none'} />
        </button>
      </div>

      {/* Price Section */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl font-bold text-gray-800">₹{product.discountedPrice.toFixed(2)}</span>
        {product.discount > 0 && (
          <span className="text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center mb-6">
        <div
          className={`w-3 h-3 rounded-full ${
            currentStock > 0 ? 'bg-green-500' : 'bg-red-500'
          } mr-2`}
        ></div>
        <span className="text-sm text-gray-600">
          {currentStock > 0 ? `In Stock (${currentStock} available)` : 'Out of Stock'}
        </span>
      </div>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Select Color</h3>
          <div className="flex flex-wrap gap-4">
            {product.colors.map((color) => (
              <div key={color.name} className="flex flex-col items-center">
                <button
                  className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                    selectedColor === color.name
                      ? 'border-blue-500 scale-110'
                      : 'border-gray-300'
                  } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}`}
                  style={{ backgroundColor: color.name.toLowerCase() }}
                  onClick={() => handleColorSelect(color.name)}
                  disabled={color.stock === 0}
                  aria-label={`Select color: ${color.name}`}
                  title={color.stock === 0 ? `${color.name} - Out of stock` : color.name}
                >
                  {selectedColor === color.name && (
                    <Check className="text-white absolute inset-0 m-auto" size={16} />
                  )}
                </button>
                <span className="text-xs mt-1 text-gray-600 capitalize">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Quantity</h3>
        <div className="flex items-center space-x-2 w-32">
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Quantity"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={incrementQuantity}
            disabled={quantity >= currentStock}
            aria-label="Increase quantity"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        className="w-full flex items-center justify-center py-3 bg-orange-800 text-white rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={currentStock === 0}
      >
        <ShoppingCart className="mr-2" size={20} />
        Add to Cart
      </button>

      {/* Brief Description */}
      <div className="mt-8 prose prose-sm max-w-none">
        <p className="text-gray-600 leading-relaxed">
          {product.description.length > 200
            ? `${product.description.substring(0, 200)}...`
            : product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;