import React from "react";
import { Link } from "react-router-dom";
import { useShowCategoriesQuery } from "../../features/categories/userCategoryApiSlice";
import { Loader2 } from 'lucide-react';

const Categories = () => {
  const {data: response, isLoading, isError} = useShowCategoriesQuery()

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

  const categories = response.categories || [];

  return (
    <section className="py-12 px-4 md:px-6 bg-ceramic-beige">
      <div className="container mx-auto">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4">
          Explore our categories
        </h2>
        <div className="flex flex-wrap justify-center -mx-2 px-8">
          {categories.map((category) => (
            <div key={category._id || category.id} className="w-1/2 md:w-1/4 px-2 mb-0">
              <Link to={{
                  pathname: "/shop",
                  search: `?categoryId=${category._id}` // Pass category ID as query parameter
                }} 
                className="block category-item group">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                  <img
                    src={category.images}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ceramic-charcoal/20 flex items-end justify-center pb-4">
                    <h3 className="text-black font-serif text-lg md:text-xl lg:text-2xl font-medium tracking-wide bg-white/55 px-2 py-13 rounded">
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
