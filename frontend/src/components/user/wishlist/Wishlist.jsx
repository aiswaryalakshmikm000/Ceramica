import React from "react";
import { ShoppingCart, X, Trash } from "lucide-react";

const Wishlist = () => {
  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = React.useState([
    {
      id: 1,
      name: "Ceramic Coffee Mug Set",
      price: "$34.99",
      originalPrice: "$49.99",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      isInStock: true
    },
    {
      id: 2,
      name: "Handcrafted Ceramic Vase",
      price: "$89.99",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      isInStock: true
    },
    {
      id: 3,
      name: "Ceramic Dinner Plate Set",
      price: "$129.99",
      originalPrice: "$159.99",
      image: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      isInStock: false
    }
  ]);

  const handleRemoveItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">My Wishlist</h1>
      
      <div className="max-w-4xl mx-auto">
        {wishlistItems.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                </h2>
                <button 
                  className="text-sm text-red-500 flex items-center hover:text-red-700 transition-colors"
                  onClick={() => setWishlistItems([])}
                >
                  <Trash size={16} className="mr-1" />
                  Clear Wishlist
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow sm:ml-6 mt-4 sm:mt-0">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      <button 
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <p className="text-lg font-medium text-gray-900">{item.price}</p>
                      {item.originalPrice && (
                        <p className="ml-2 text-sm text-gray-500 line-through">{item.originalPrice}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        {item.isInStock ? (
                          <span className="text-sm text-green-600">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600">Out of Stock</span>
                        )}
                      </div>
                      
                      <button
                        disabled={!item.isInStock}
                        className={`py-2 px-4 rounded-md flex items-center text-sm ${
                          item.isInStock 
                            ? "bg-gray-900 text-white hover:bg-gray-800" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-500">Add items to your wishlist to save them for later.</p>
            <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;