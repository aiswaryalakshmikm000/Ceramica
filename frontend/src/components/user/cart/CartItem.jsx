import React from "react";
import { Trash2 } from "lucide-react";
import QuantityControl from "./QuantityControl";
import { useNavigate } from "react-router-dom";

const CartItem = ({
  id,
  name,
  originalPrice,
  latestPrice,
  discount,
  quantity,
  image,
  color,
  inStock,
  stock,
  onRemove,
  onUpdateQuantity,
}) => {
  const discountedPrice = latestPrice;
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/shop/${id}`);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start sm:space-x-4 mb-4 animate-fade-in ${
        !inStock || stock === 0 ? "bg-red opacity-75 border border-red-800/50" : ""
      }`}
    >
      {/* Image */}
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-sm flex-shrink-0 cursor-pointer mb-3 sm:mb-0"
        onClick={() => handleProductClick(id)}
      >
        <img
          src={image || ""}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "";
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full justify-between">
        <div>
          {/* Top Row - Name and Remove Button */}
          <div className="flex justify-between items-start">
            <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-800">
              {name} <span className="text-xs sm:text-sm lg:text-sm text-gray-500">({color})</span>
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id, color);
              }}
              className="text-orange-800 hover:text-orange-900 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={16} className="sm:w-18 sm:h-18" />
            </button>
          </div>

          {/* Stock Status */}
          <div className="mt-1">
            {(!inStock || stock === 0) ? (
              <p className="text-red-600 text-xs sm:text-sm lg:text-sm font-medium">Out of Stock</p>
            ) : stock < 5 ? (
              <p className="text-orange-600 text-xs sm:text-sm lg:text-sm font-medium">{stock} left</p>
            ) : null}
          </div>
          
          {/* Price Information */}
          <div className="flex items-center space-x-2 sm:space-x-3 mt-2">
            <p className="text-gray-800 font-semibold text-base sm:text-lg lg:text-lg">
              ₹{discountedPrice.toFixed(2)}
            </p>
            {discount > 0 && (
              <>
                <p className="text-gray-400 line-through text-xs sm:text-sm lg:text-sm">
                  ₹{originalPrice.toFixed(2)}
                </p>
                <p className="text-green-600 text-xs sm:text-sm lg:text-sm">({discount}% off)</p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Row - Quantity and Total */}
        <div className="flex justify-between items-center mt-3 sm:mt-4">
          <QuantityControl
            quantity={quantity}
            onIncrease={() => inStock && onUpdateQuantity(quantity + 1)}
            onDecrease={() => inStock && onUpdateQuantity(quantity - 1)}
            size="sm"
            disabled={!inStock}
          />
          <p className="font-semibold text-gray-800 text-base sm:text-lg lg:text-lg">
            ₹{(discountedPrice * quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;