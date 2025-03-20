
import React, { useState, useEffect } from 'react';
import { useFetchProductsQuery } from '../../features/products/userProductApislice';
import { useShowCategoriesQuery } from '../../features/categories/userCategoryApiSlice';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../common/BreadCrumbs';
import PriceRangeFilter from './filter/PriceRangeFilter';
import ColorFilter from './filter/ColorFilter';
import SortFilter from './filter/SortFilter';
import ProductsGrid from './ProductGrid';
import ShopHeader from './ShopHeader';
import Categories from '../common/Categories';
import Pagination from '../common/Pagination';

const Shop = () => {
  const location = useLocation();

  // Define initial filter state with search included
  const initialFilters = {
    search: '', 
    priceRange: { min: 0, max: 5000 },
    colors: [],
    sort: 'featured',
    page: 1,
    limit: 8,
    categoryId: null,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [resetTrigger, setResetTrigger] = useState(0);

  const { data: categoriesData, isLoading: categoriesLoading } = useShowCategoriesQuery();

  // Set filters from URL on initial load (categoryId and search)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const searchTerm = searchParams.get('search') || '';
    console.log("URL Params:", { categoryId, searchTerm });
    setFilters(prev => ({
      ...prev, 
      categoryId: categoryId || null,
      search: searchTerm, 
      page: 1, 
    }));
  }, [location.search]);

  // Map filters to API query parameters
  const queryParams = {
    search: filters.search || undefined, 
    minPrice: filters.priceRange.min,
    maxPrice: filters.priceRange.max,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
    categoryId: filters.categoryId || undefined,
    ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
  };

  console.log("Query Params:", queryParams); // Debug log

  const { data, isLoading, isFetching, error } = useFetchProductsQuery(queryParams);

  console.log("API Response:", data); // Debug log

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

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setResetTrigger(prev => prev + 1);
  };

  const getCategoryName = () => {
    if (!filters.categoryId || !categoriesData?.categories) return null;
    const category = categoriesData.categories.find(cat => cat._id === filters.categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const categoryName = getCategoryName();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(filters.categoryId && categoryName && !categoriesLoading
      ? [{ label: categoryName, href: location.pathname + location.search }]
      : []),
    ...(filters.search ? [{ label: `Search: "${filters.search}"`, href: null }] : []),
  ];

  return (
    <div className="py-16 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <Breadcrumbs items={breadcrumbItems} />
        <Categories />
        <ShopHeader />

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
            <SortFilter
              onChange={handleSortChange}
              initialSort={filters.sort}
              resetTrigger={resetTrigger}
            />
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm text-gray-700">Items per page:</label>
              <select
                id="limit"
                value={filters.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-700"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-red-600">Error loading products</h3>
            <p className="mt-2 text-gray-500">{error.data?.message || 'Something went wrong'}</p>
          </div>
        ) : (
          <ProductsGrid
            products={data?.filteredProducts}
            isLoading={isLoading || isFetching}
          />
        )}

        {data && (
          <Pagination
            currentPage={filters.page}
            totalPages={data.totalPages || 1}
            totalItems={data.totalProductsCount || 0}
            itemsPerPage={filters.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Shop;