import React from 'react';
import ProductCard from '../../common/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetchFeaturedProductsQuery } from '../../../features/userAuth/userProductApislice';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const { 
    data: response, 
    isLoading, 
    isError, 
    error 
  } = useFetchFeaturedProductsQuery({ limit: 8 });

  console.log(response);


  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceramic-accent" />
        </div>
      );
    }

  if (isError || !response?.success) {
    return (
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center text-red-500">
            Error loading featured products: {error?.data?.message || response?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  const featuredProducts = response.filteredFeaturedProducts || [];

  return (
    <div className="py-16 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4">
              Featured Collection
            </h2>
            <p className="text-ceramic-dark/70 max-w-lg">
              Discover our most loved ceramic pieces, crafted with precision and artistic expression
            </p>
          </div>
          <Link 
            to="/shop" 
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-ceramic-accent hover:text-ceramic-dark transition-colors group"
          >
            View All Products
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    discountedPrice: product.discountedPrice, 
                    image:  product.colors?.[0]?.images?.[0] || product.images?.[0],
                    inStock: product.totalStock > 0,
                  }} 
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(4, 8).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={{
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    discountedPrice: product.discountedPrice, 
                    image:  product.colors?.[0]?.images?.[0] || product.images?.[0],
                    inStock: product.totalStock > 0,
                  }} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-ceramic-dark/70">
            No featured products available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;