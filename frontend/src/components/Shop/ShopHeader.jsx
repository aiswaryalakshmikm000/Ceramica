import React from 'react';

const ShopHeader = ({ productCount }) => {
  return (
    <div className="mb-6 animate-slide-down">
    
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-ceramic-dark mb-4">
      Ceramic Collection
            </h2>
      <p className="text-ceramic-text/70">
        Discover our handcrafted ceramic pieces, each one unique and made with passion.
        {productCount && <span className="ml-1">Showing {productCount} products</span>}
      </p>
    </div>
  );
};

export default ShopHeader;
