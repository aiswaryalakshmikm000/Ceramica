import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CategoryFilter = ({ onChange, initialCategories = [], resetTrigger, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedCategories(initialCategories);
  }, [resetTrigger, initialCategories]);

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

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    onChange(newCategories);
  };

  const getSelectedCount = () => {
    return selectedCategories.length > 0 ? `(${selectedCategories.length})` : '';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between min-w-[160px] hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-700">Categories {getSelectedCount()}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown absolute left-0 top-full mt-1 w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-10 p-4">
          <h3 className="font-medium text-sm mb-3">Select Categories</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories?.map((category) => (
              <div
                key={category._id}
                onClick={() => toggleCategory(category._id)}
                className="flex items-center cursor-pointer px-2 py-1 hover:bg-gray-50 rounded"
              >
                <div
                  className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                    selectedCategories.includes(category._id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {selectedCategories.includes(category._id) && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
          
          {selectedCategories.length > 0 && (
            <button
              onClick={() => {
                setSelectedCategories([]);
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

export default CategoryFilter;