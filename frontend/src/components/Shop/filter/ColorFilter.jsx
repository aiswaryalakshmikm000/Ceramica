import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const ColorFilter = ({ onChange, initialColors = [], resetTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState(initialColors);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedColors(initialColors);
  }, [resetTrigger, initialColors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const colorOptions = [
    { name: 'brown', hex: '#8B4513' },
    { name: 'orange', hex: '#D35400' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'beige', hex: '#F5F5DC' },
    { name: 'gray', hex: '#A9A9A9' },
    { name: 'blue', hex: '#3498DB' },
    { name: 'black', hex: '#000000' },
    { name: 'pink', hex: '#FFC0CB' },
    { name: 'mint', hex: '#AAF0D1' },
  ];

  const toggleColor = (colorName) => {
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter(c => c !== colorName)
      : [...selectedColors, colorName];
    
    setSelectedColors(newColors);
    onChange(newColors);
  };

  const getSelectedCount = () => {
    return selectedColors.length > 0 ? `(${selectedColors.length})` : '';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between w-full sm:min-w-[130px] hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-700 truncate">Colors {getSelectedCount()}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown absolute left-0 top-full mt-1 w-full sm:w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-10 p-4">
          <h3 className="font-medium text-sm mb-3">Select Colors</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {colorOptions.map((color) => (
              <div
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`color-swatch flex items-center justify-center cursor-pointer rounded-md ${
                  selectedColors.includes(color.name) ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ 
                  backgroundColor: color.hex,
                  width: '32px',
                  height: '32px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
                title={color.name}
              >
                {selectedColors.includes(color.name) && (
                  <Check 
                    size={14} 
                    className={`${['white', 'beige', 'mint'].includes(color.name) ? 'text-black' : 'text-white'}`} 
                  />
                )}
              </div>
            ))}
          </div>
          
          {selectedColors.length > 0 && (
            <button
              onClick={() => {
                setSelectedColors([]);
                onChange([]);
              }}
              className="mt-3 text-xs text-gray-500 hover:text-black transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorFilter;