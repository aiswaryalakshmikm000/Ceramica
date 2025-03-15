import React, { useState, useEffect } from 'react';
import { useFetchProductsQuery } from '../../features/products/userProductApislice';
import Breadcrumbs from '../common/BreadCrumbs';
import PriceRangeFilter from './filter/PriceRangeFilter';
import ColorFilter from './filter/ColorFilter';
import SortFilter from './filter/SortFilter';
import ProductsGrid from './ProductGrid';
import ShopHeader from './ShopHeader';

const Shop = () => {
  // Define initial filter state
  const initialFilters = {
    priceRange: { min: 0, max: 5000 },
    colors: [],
    sort: 'featured',
    page: 1
  };

  // Filters state
  const [filters, setFilters] = useState(initialFilters);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Map filters to API query parameters
  const queryParams = {
    minPrice: filters.priceRange.min,
    maxPrice: filters.priceRange.max,
    sort: filters.sort,
    page: filters.page,
    ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
  };

  // Fetch products with current queryParams
  const { data, isLoading, isFetching, error } = useFetchProductsQuery(queryParams);

  console.log('Fetch result:', { data, isLoading, isFetching, error });

  // Filter handlers
  const handlePriceRangeChange = (priceRange) => {
    setFilters(prev => ({ ...prev, priceRange, page: 1 }));
  };
  
  const handleColorChange = (colors) => {
    setFilters(prev => ({ ...prev, colors, page: 1 }));
  };
  
  const handleSortChange = (sort) => {
    setFilters(prev => ({ ...prev, sort }));
  };
  
  // Reset handler
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setResetTrigger(prev => prev + 1);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];
  
  // Calculate showing x of y products text
  const getShowingText = () => {
    if (!data) return 'Showing 0 products';
    const { products, totalProductsCount } = data;
    console.log("products:", products);
    console.log("totalProducts:", totalProductsCount);
    return `Showing ${products.length} of ${totalProductsCount} products`;
  };
  
  return (
    <div className="py-16 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        <ShopHeader/>
        
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-3 items-center">
            <PriceRangeFilter 
              onChange={handlePriceRangeChange} 
              initialRange={filters.priceRange}
              resetTrigger={resetTrigger}
            />
            <ColorFilter 
              onChange={handleColorChange}
              initialColors={filters.colors}
              resetTrigger={resetTrigger}
            />
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4">
            <p className="text-sm text-ceramic-dark/60">
              {getShowingText()}
            </p>
            <SortFilter
              onChange={handleSortChange}
              initialSort={filters.sort}
              resetTrigger={resetTrigger}
            />
          </div>
        </div>
        
        {error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-red-600">Error loading products</h3>
            <p className="mt-2 text-gray-500">{error.data?.message || 'Something went wrong'}</p>
          </div>
        ) : (
          <ProductsGrid 
            products={data?.products} 
            isLoading={isLoading || isFetching}
          />
        )}
      </div>
    </div>
  );
};

export default Shop;