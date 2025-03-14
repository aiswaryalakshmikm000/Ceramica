import React from "react";
import { Link } from "react-router-dom";
import bowls from "../../assets/Category/bowls.avif";
import mugs from "../../assets/Category/mugs.avif";
import pots from "../../assets/Category/pots.avif";
import plates from "../../assets/Category/plates.avif";

const categories = [
  {
    id: 1,
    name: "Mugs",
    image: mugs,
    link: "/shop/mugs",
  },
  {
    id: 2,
    name: "Pots",
    image: pots,
    link: "/shop/pots",
  },
  {
    id: 3,
    name: "Plates",
    image: plates,
    link: "/shop/plates",
  },
  {
    id: 4,
    name: "Bowls",
    image: bowls,
    link: "/shop/bowls",
  },
];

const Categories = () => {
  return (
    <section className="py-12 px-4 md:px-6 bg-ceramic-beige">
      <div className="container mx-auto">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4">
          Explore our categories
        </h2>
        <div className="flex flex-wrap justify-center -mx-2 px-8">
          {categories.map((category) => (
            <div key={category.id} className="w-1/2 md:w-1/4 px-2 mb-0">
              <Link to={category.link} className="block category-item group">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ceramic-charcoal/20 flex items-end justify-center pb-4 ">
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
