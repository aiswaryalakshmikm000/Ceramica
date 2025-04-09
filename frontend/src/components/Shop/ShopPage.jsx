

import React, { useState, useEffect } from 'react';
import { useFetchProductsQuery } from '../../features/userAuth/userProductApislice';
import { useShowCategoriesQuery } from '../../features/userAuth/userCategoryApiSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../common/BreadCrumbs';
import PriceRangeFilter from './filter/PriceRangeFilter';
import ColorFilter from './filter/ColorFilter';
import CategoryFilter from './filter/CategoryFilter';
import SortFilter from './filter/SortFilter';
import ProductsGrid from './ProductGrid';
import ShopHeader from './ShopHeader';
import Pagination from '../common/Pagination';
import { useAddToCartMutation } from '../../features/userAuth/userCartApislice';
import Fallback from '../common/Fallback';
import { ShoppingBag } from 'lucide-react';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialFilters = {
    search: '',
    priceRange: { min: 0, max: 5000 },
    colors: [],
    categoryIds: [],
    sort: 'featured',
    page: 1,
    limit: 8,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [resetTrigger, setResetTrigger] = useState(0);

  const { data: categoriesData, isLoading: categoriesLoading } = useShowCategoriesQuery();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryIdsFromUrl = searchParams.get('categoryIds')?.split(',').filter(Boolean) || [];
    const searchTermFromUrl = searchParams.get('search') || '';

    setFilters(prev => ({
      ...prev,
      categoryIds: categoryIdsFromUrl.length > 0 ? categoryIdsFromUrl : prev.categoryIds,
      search: searchTermFromUrl || prev.search,
      page: 1,
    }));
  }, [location.search]);

  const queryParams = {
    search: filters.search || undefined,
    minPrice: filters.priceRange.min,
    maxPrice: filters.priceRange.max,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
    ...(filters.categoryIds.length > 0 && { categoryIds: filters.categoryIds.join(',') }),
    ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
  };

  const { data, isLoading, isFetching, error } = useFetchProductsQuery(queryParams);

  const handlePriceRangeChange = (priceRange) => {
    setFilters(prev => ({ ...prev, priceRange, page: 1 }));
  };

  const handleColorChange = (colors) => {
    setFilters(prev => ({ ...prev, colors, page: 1 }));
  };

  const handleCategoryChange = (categoryIds) => {
    setFilters(prev => ({ ...prev, categoryIds, page: 1 }));
    const newParams = new URLSearchParams(location.search);
    if (categoryIds.length > 0) {
      newParams.set('categoryIds', categoryIds.join(','));
    } else {
      newParams.delete('categoryIds');
    }
    navigate(`/shop?${newParams.toString()}`, { replace: true });
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
    navigate('/shop');
  };

  const getCategoryNames = () => {
    if (!filters.categoryIds.length || !categoriesData?.categories) return null;
    const selected = categoriesData.categories.filter(cat => filters.categoryIds.includes(cat._id));
    return selected.map(cat => cat.name).join(', ') || 'Unknown Categories';
  };

  const categoryNames = getCategoryNames();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(filters.categoryIds.length > 0 && categoryNames && !categoriesLoading
      ? [{ label: categoryNames, href: location.pathname + location.search }]
      : []),
    ...(filters.search ? [{ label: `Search: "${filters.search}"`, href: null }] : []),
  ];

  return (
    <div className="py-16 md:py-12 bg-ceramic-gray-light">
      <div className="container mx-auto px-4 md:px-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ShopHeader productCount={data?.totalProductsCount} />

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
            <CategoryFilter
              onChange={handleCategoryChange}
              initialCategories={filters.categoryIds}
              resetTrigger={resetTrigger}
              categories={categoriesData?.categories || []}
            />
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-white border border-ceramic-gray-light rounded-lg text-sm text-ceramic-gray-text hover:bg-ceramic-blue-50 transition-colors"
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
              <select
                id="limit"
                value={filters.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-2 py-2 border border-ceramic-gray-light rounded-lg text-sm text-ceramic-gray-text focus:ring-ceramic-blue focus:border-ceramic-blue"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>
        </div>

        <Fallback
          isLoading={isLoading || isFetching}
          error={error}
          emptyMessage={data?.filteredProducts?.length === 0 ? "No products found matching your filters" : null}
          emptyActionText="Reset Filters"
          onEmptyAction={handleResetFilters} 
          emptyIcon={<ShoppingBag />}
        />

        {data && data.filteredProducts?.length > 0 && (
          <>
            <ProductsGrid
              products={data.filteredProducts}
              isLoading={isLoading || isFetching}
            />
            <Pagination
              currentPage={filters.page}
              totalPages={data.totalPages || 1}
              totalItems={data.totalProductsCount || 0}
              itemsPerPage={filters.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;