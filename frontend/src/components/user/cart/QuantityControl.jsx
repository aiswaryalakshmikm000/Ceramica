import React from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center bg-orange-50 rounded-full p-1">
      <button 
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
        disabled={quantity <= 1}
      >
        <Minus size={16} className="text-orange-500" />
      </button>
      <span className="mx-3 w-6 text-center font-medium text-orange-700">{quantity}</span>
      <button 
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
      >
        <Plus size={16} className="text-orange-500" />
      </button>
    </div>
  );
};

export default QuantityControl;