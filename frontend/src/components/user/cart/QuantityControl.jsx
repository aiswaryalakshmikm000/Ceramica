import React from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center bg-orange-50 rounded-full p-">
      <button 
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
        disabled={quantity <= 1}
      >
        <Minus size={16} className="text-orange-800" />
      </button>
      <span className="mx-3 w-6 text-center font-medium text-black-800">{quantity}</span>
      <button 
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
      >
        <Plus size={16} className="text-orange-800" />
      </button>
    </div>
  );
};

export default QuantityControl;