import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../common/ProductCard";

const RelatedProducts = ({ products }) => {

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [products]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth / 2;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-16 animate-fade-in">
      <h3 className="text-xl font-medium text-ceramic-dark mb-6">
        Related Products
      </h3>

      <div className="relative">
        <button
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10
                   p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md
                   ${
                     canScrollLeft
                       ? "opacity-90"
                       : "opacity-0 pointer-events-none"
                   }
                   transition-opacity duration-300 hover:bg-ceramic-accent hover:text-white`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10
                   p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md
                   ${
                     canScrollRight
                       ? "opacity-90"
                       : "opacity-0 pointer-events-none"
                   }
                   transition-opacity duration-300 hover:bg-ceramic-accent hover:text-white`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full max-w-[50%] md:max-w-[25%] flex-shrink-0" 
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
