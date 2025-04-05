
import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
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
import Breadcrumbs from "../../common/BreadCrumbs";

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

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              My Wishlist {/*({wishlistItems.length}) */}
            </h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

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
            <div className="space-y-4 mt-6">
              {wishlistItems.map((item) => (
                <div
                  key={`${item.productId?._id}-${item.color}`}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-start space-x-6 mb-4 animate-fade-in ${
                    !item.inStock ? "opacity-75 border border-red-300" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className="w-32 h-32 rounded-lg overflow-hidden shadow-sm flex-shrink-0 cursor-pointer"
                    onClick={() => handleProductClick(item.productId?._id)}
                  >
                    <img
                      src={item?.image || item.productId?.image || ""}
                      alt={item.productId?.name || "Product"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "";
                      }}
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      {/* Top Row - Name and Remove Button */}
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-orange-800"
                          onClick={() => handleProductClick(item.productId?._id)}
                        >
                          {item.productId?.name || "Unknown Product"}{" "}
                          <span className="text-sm text-gray-500">({item.color})</span>
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.productId?._id, item.color)}
                          className="text-orange-800 hover:text-orange-900 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Stock Status */}
                      {!item.inStock && (
                        <p className="text-red-600 text-sm mt-1">Out of Stock</p>
                      )}

                      {/* Price Information */}
                      <div className="flex items-center space-x-3 mt-2">
                        <p className="text-gray-800 font-semibold text-lg">
                          ₹{item.discountedPrice.toFixed(2)}
                        </p>
                        {item.originalPrice > item.discountedPrice && (
                          <>
                            <p className="text-gray-400 line-through text-sm">
                              ₹{item.originalPrice.toFixed(2)}
                            </p>
                            <p className="text-green-600 text-sm">
                              (
                              {Math.round(
                                ((item.originalPrice - item.discountedPrice) /
                                  item.originalPrice) *
                                  100
                              )}
                              % off)
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row - Add to Cart */}
                    <div className="mt-4 flex justify-end">
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