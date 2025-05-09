import React from "react";
import { Link } from "react-router-dom";
import { useShowCategoriesQuery } from "../../features/userAuth/userCategoryApiSlice";
import { Loader2 } from 'lucide-react';

const Categories = () => {
  const {data: response, isLoading, isError} = useShowCategoriesQuery()
 
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
        <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
          <div className="text-center text-red-500">
            Error loading featured products: {error?.data?.message || response?.message || 'Something went wrong'}
          </div>
        </div>
      </div>
    );
  }

  const categories = response.categories || [];

  return (
    <section className="py-1 bg-ceramic-beige">
      <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4 sm:mb-6 lg:mb-8">
          Explore our categories
        </h2>
        <div className="flex flex-wrap justify-center -mx-2 px-2 sm:px-4">
          {categories.map((category) => (
            <div key={category._id || category.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4 sm:mb-6">
              <Link to={{
                  pathname: "/shop",
                  search: `?categoryIds=${category._id}` 
                }} 
                className="block category-item group">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                  <img
                    src={category.images}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ceramic-charcoal/20 flex items-end justify-center pb-3 sm:pb-4">
                    <h3 className="text-black font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wide bg-white/55 px-2 py-1 sm:py-2 rounded">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;