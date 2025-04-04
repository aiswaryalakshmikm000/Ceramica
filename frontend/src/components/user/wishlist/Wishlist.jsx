// import React from "react";
// import { ShoppingCart, X } from "lucide-react";
// import { 
//   useFetchWishlistQuery, 
//   useRemoveFromWishlistMutation,
// } from "../../../features/userAuth/userWishlistApiSlice"; 
// import { 
//   useAddToCartMutation 
// } from "../../../features/userAuth/userCartApislice"; 
// import { useSelector } from "react-redux";
// import { selectUser } from "../../../features/userAuth/userAuthSlice"; 
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"; 
// import "react-toastify/dist/ReactToastify.css"; 

// const Wishlist = () => {  
//   const user = useSelector(selectUser);
//   const userId = user?._id;
//   const navigate = useNavigate();

//   const { data, isLoading, error, refetch } = useFetchWishlistQuery(userId, {
//     skip: !userId,
//   });
//   const wishlistItems = data?.items;
//   const [removeFromWishlist] = useRemoveFromWishlistMutation();
//   const [addToCart] = useAddToCartMutation();

//   const handleRemoveItem = async (productId, color) => {
//     try {
//       await removeFromWishlist({ userId, productId, color }).unwrap();
//       toast.success("Item removed from wishlist");
//     } catch (err) {
//       toast.error("Failed to remove item from wishlist");
//       console.error('Failed to remove item:', err);
//     }
//   };

//   const handleAddToCart = async (productId, color) => {
//     try {
//       const result = await addToCart({ userId, productId, quantity: 1, color }).unwrap();
//       toast.success(result.message);
//       // Refetch wishlist to update the UI
//       refetch();
//     } catch (err) {
//       toast.error("Failed to add item to cart");
//       console.error('Failed to add to cart:', err);
//     }
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/shop/${productId}`);
//   };

//   if (!userId) return <div>Please log in to view your wishlist.</div>;
//   if (isLoading) return <div>Loading wishlist...</div>;
//   if (error) return <div>Error loading wishlist: {error.message}</div>;

//   return (
//     <div className="container mx-auto px-4 py-20 my-7">
      
//       <div className="max-w-4xl mx-auto">
//         {wishlistItems && wishlistItems.length > 0 ? (
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-900">
//                 {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
//               </h2>
//             </div>
            
//             <div className="divide-y divide-gray-200">
//               {wishlistItems.map((item) => (
//                 <div key={`${item.productId?._id}-${item.color}`} className="p-4 flex flex-col sm:flex-row">
//                   <div 
//                     className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
//                     onClick={() => handleProductClick(item.productId?._id)}
//                   >
//                     <img 
//                       src={item?.image || item.productId?.image || ""} 
//                       alt={item.productId?.name || "Product"} 
//                       className="w-full h-full object-contain"
//                       onError={(e) => {
//                         e.target.src = "";
//                       }}
//                     />
//                   </div>
                  
//                   <div className="flex-grow sm:ml-6 mt-4 sm:mt-0">
//                     <div className="flex justify-between">
//                       <h3 className="text-base font-medium text-gray-900">{item.productId?.name || "Unknown Product"}</h3>
//                       <button 
//                         className="text-gray-400 hover:text-gray-500"
//                         onClick={() => handleRemoveItem(item.productId?._id, item.color)}
//                       >
//                         <X size={18} />
//                       </button>
//                     </div>
                    
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-600">Color: <span className="capitalize">{item.color}</span></p>
//                       <div className="flex items-center">
//                         <p className="text-lg font-medium text-gray-900">₹{item.discountedPrice}</p>
//                         {item.originalPrice > item.discountedPrice && (
//                           <>
//                             <p className="ml-2 text-sm text-gray-500 line-through">₹{item.originalPrice}</p>
//                             <p className="ml-2 text-sm text-green-600">
//                               ({Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% off)
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="mt-4 flex justify-between items-center">
//                       <div>
//                         {item.inStock ? (
//                           <span className="text-sm text-green-600">In Stock</span>
//                         ) : (
//                           <span className="text-sm text-red-600">Out of Stock</span>
//                         )}
//                       </div>
                      
//                       <button
//                         disabled={!item.inStock}
//                         onClick={() => handleAddToCart(item.productId?._id, item.color)}
//                         className={`py-2 px-4 rounded-md flex items-center text-sm ${
//                           item.inStock 
//                             ? "bg-orange-800/90 text-white hover:bg-orange-800" 
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                       >
//                         <ShoppingCart size={16} className="mr-2" />
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-white rounded-lg shadow">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
//             <p className="text-gray-500">Add items to your wishlist to save them for later.</p>
//             <button 
//               className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
//               onClick={() => navigate("/shop")}
//             >
//               Continue Shopping
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;



import React from "react";
import { ShoppingCart, X } from "lucide-react";
import {
  useFetchWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../../features/userAuth/userWishlistApiSlice";
import { useAddToCartMutation } from "../../../features/userAuth/userCartApislice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fallback from "../../common/Fallback";

const Wishlist = () => {
  const user = useSelector(selectUser);
  const userId = user?._id;
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useFetchWishlistQuery(userId, {
    skip: !userId,
  });
  const wishlistItems = data?.items || [];
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const handleRemoveItem = async (productId, color) => {
    try {
      await removeFromWishlist({ userId, productId, color }).unwrap();
      toast.success("Item removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item from wishlist");
      console.error("Failed to remove item:", err);
    }
  };

  const handleAddToCart = async (productId, color) => {
    try {
      const result = await addToCart({ userId, productId, quantity: 1, color }).unwrap();
      toast.success(result.message);
      refetch();
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Failed to add to cart:", err);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/${productId}`);
  };

  // Handle loading, error, and no-user states with Fallback
  if (isLoading || error || !user) {
    return (
      <Fallback
        isLoading={isLoading}
        error={error}
        noUser={!user}
        emptyMessage={null}
        emptyActionText="Continue Shopping"
        emptyActionPath="/shop"
      />
    );
  }

  const isWishlistEmpty = !wishlistItems || wishlistItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              My Wishlist {/*({wishlistItems.length}) */}
            </h2>
          </div>

          {/* Show Fallback for empty wishlist */}
          {isWishlistEmpty ? (
            <Fallback
              isLoading={false}
              error={null}
              noUser={false}
              emptyMessage="Your wishlist is empty"
              emptyActionText="Continue Shopping"
              emptyActionPath="/shop"
            />
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={`${item.productId?._id}-${item.color}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div
                    className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(item.productId?._id)}
                  >
                    <img
                      src={item?.image || item.productId?.image || ""}
                      alt={item.productId?.name || "Product"}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "";
                      }}
                    />
                  </div>

                  <div className="flex-grow sm:ml-6 mt-4 sm:mt-0 w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-medium text-gray-900 cursor-pointer hover:text-orange-800"
                        onClick={() => handleProductClick(item.productId?._id)}>
                        {item.productId?.name || "Unknown Product"}
                      </h3>
                      <button
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveItem(item.productId?._id, item.color)}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Color: <span className="capitalize">{item.color}</span>
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">₹{item.discountedPrice}</p>
                        {item.originalPrice > item.discountedPrice && (
                          <>
                            <p className="ml-2 text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </p>
                            <p className="ml-2 text-sm text-green-600">
                              ({Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% off)
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        {item.inStock ? (
                          <span className="text-sm text-green-600">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600">Out of Stock</span>
                        )}
                      </div>

                      <button
                        disabled={!item.inStock}
                        onClick={() => handleAddToCart(item.productId?._id, item.color)}
                        className={`py-2 px-4 rounded-md flex items-center text-sm transition-colors ${
                          item.inStock
                            ? "bg-orange-800/90 text-white hover:bg-orange-900"
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
          )}

          {/* Show "Continue Shopping" button only when wishlist has items */}
          {!isWishlistEmpty && (
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 w-full text-black-800 hover:text-orange-900 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
