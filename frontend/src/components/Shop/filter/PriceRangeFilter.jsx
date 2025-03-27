import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const PriceRangeFilter = ({ onChange, initialRange = { min: 0, max: 5000 }, resetTrigger }) => {
  const DEFAULT_RANGE = { min: 0, max: 5000 }; 
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState(initialRange); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log('Reset triggered:', { resetTrigger, initialRange });
    setRange(DEFAULT_RANGE); 
  }, [resetTrigger]);

  useEffect(() => {
    console.log('Initial range updated:', initialRange);
    setRange(initialRange);
  }, [initialRange]);

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

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    const newValue = value === '' ? 0 : parseInt(value, 10);
    setRange(prev => {
      const newRange = { ...prev, [name]: newValue };
      console.log('Range updated:', newRange);
      return newRange;
    });
  };

  const handleApply = () => {
    const validRange = {
      min: Math.min(range.min, range.max),
      max: Math.max(range.min, range.max),
    };
    console.log('Applying range:', validRange);
    setRange(validRange);
    onChange(validRange);
    setIsOpen(false);
  };

  const displayText = range.min === DEFAULT_RANGE.min && range.max === DEFAULT_RANGE.max
    ? 'Price Range'
    : `₹${range.min} - ₹${range.max}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between min-w-[160px] hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-700">{displayText}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown absolute left-0 top-full mt-1 w-60 bg-white shadow-lg rounded-lg border border-gray-100 z-10 p-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  name="min"
                  value={range.min === 0 && range.min !== DEFAULT_RANGE.min ? '' : range.min}
                  onChange={handleRangeChange}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                  placeholder="₹0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  name="max"
                  value={range.max === 0 && range.max !== DEFAULT_RANGE.max ? '' : range.max}
                  onChange={handleRangeChange}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                  placeholder="₹5000"
                />
              </div>
            </div>
            <button
              onClick={handleApply}
              className="w-full py-1.5 bg-black text-white text-sm rounded hover:bg-black/80 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRangeFilter;