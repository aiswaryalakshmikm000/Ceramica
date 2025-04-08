import React from 'react';
import ProductCard from '../common/ProductCard';

const ProductsGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-xl font-medium text-gray-600">No products found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={{
              id: product._id || product.id,
              name: product.name,
              price: product.price,
              colors: product.colors,
              discount: product.discount,
              discountedPrice: product.discountedPrice,
              image: product.colors?.[0]?.images?.[0] || product.images?.[0],
              inStock: product.totalStock > 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
          style={{ transform: 'translateX(-100%)' }}
        ></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export default ProductsGrid;