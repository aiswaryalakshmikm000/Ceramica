import React from "react";
import { Check } from "lucide-react";

const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
  disabled = false,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-800 mb-3">Select Color</h3>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <div key={color.name} className="flex flex-col items-center">
            <button
              className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                selectedColor === color.name
                  ? "border-red-500 scale-110"
                  : "border-white-300"
              } ${
                color.stock === 0 || disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-500"
              }`}
              style={{ backgroundColor: color.name.toLowerCase() }}
              onClick={() => !disabled && onColorSelect(color.name)}
              disabled={color.stock === 0 || disabled}
              aria-label={`Select color: ${color.name}`}
              title={
                color.stock === 0
                  ? `${color.name} - Out of stock`
                  : color.name
              }
            >
              {selectedColor === color.name && (
                <Check
                  className="text-white absolute inset-0 m-auto"
                  size={16}
                />
              )}
            </button>
            <span className="text-xs mt-1 text-gray-600 capitalize">
              {color.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;