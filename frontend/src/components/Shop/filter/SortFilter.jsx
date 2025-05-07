import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SortFilter = ({ onChange, initialSort = 'featured', resetTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedSort(initialSort);
  }, [resetTrigger, initialSort]);
  
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

  const sortOptions = [
    { value: 'all', label: 'All' },
    { value: 'featured', label: 'Featured' },
    { value: 'priceLowHigh', label: 'Price: Low to High' },
    { value: 'priceHighLow', label: 'Price: High to Low' },
    { value: 'nameAZ', label: 'Name: A to Z' },
    { value: 'nameZA', label: 'Name: Z to A' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'averageRating', label: 'Highest Rated' },
    { value: 'newArrivals', label: 'New Arrivals' },
  ];

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    onChange(value);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    const option = sortOptions.find(opt => opt.value === selectedSort);
    return option ? option.label : 'Sort';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between w-full sm:min-w-[160px] hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-700 truncate">{getSelectedLabel()}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown absolute right-0 top-full mt-1 w-full sm:w-48 bg-white shadow-lg rounded-lg border border-gray-100 z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selectedSort === option.value ? 'font-medium bg-gray-50' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilter;