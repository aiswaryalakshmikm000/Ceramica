import React from 'react';
import { Trash2 } from 'lucide-react';
import QuantityControl from './QuantityControl';

const CartItem = ({ 
  id, 
  name, 
  originalPrice,
  latestPrice,
  discount,
  quantity, 
  image, 
  color,
  onRemove,
  onUpdateQuantity 
}) => {
  const discountedPrice = latestPrice;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex items-center space-x-6 mb-6 animate-fade-in">
      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-sm">
        <img
          src={image || "https://placehold.co/200x200/FFFAF5/F97316?text=Product"}
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
          onError={(e) => {
            e.target.src = "https://placehold.co/200x200/FFFAF5/F97316?text=Product";
          }}
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{name} ({color})</h3>
          <button
            onClick={() => onRemove(id, color)}
            className="text-orange-500 hover:text-orange-700 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <p className="text-orange-600 font-bold text-lg">₹{discountedPrice.toFixed(2)}</p>
          {discount > 0 && (
            <>
              <p className="text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
              <p className="text-green-600 text-sm">({discount}% off)</p>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <QuantityControl
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(quantity + 1)} // Pass only the new quantity
            onDecrease={() => onUpdateQuantity(quantity - 1)} // Pass only the new quantity
          />
          <p className="font-bold text-gray-800 text-lg">
            ₹{(discountedPrice * quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;