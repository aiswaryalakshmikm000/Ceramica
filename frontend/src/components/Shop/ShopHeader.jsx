import React from 'react';

const ShopHeader = ({ productCount }) => {
  return (
    <div className="mb-6 animate-slide-down">
      <h1 className="text-3xl font-light text-ceramic-dark mb-2">
        Ceramic Collection
      </h1>
      <p className="text-ceramic-text/70">
        Discover our handcrafted ceramic pieces, each one unique and made with passion.
        {productCount && <span className="ml-1">Showing {productCount} products</span>}
      </p>
    </div>
  );
};

export default ShopHeader;
