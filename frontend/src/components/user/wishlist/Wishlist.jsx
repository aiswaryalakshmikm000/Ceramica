import React from "react";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
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
  const userId = user?.id;
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
    }
  };

  const handleAddToCart = async (productId, color) => {
    try {
      const result = await addToCart({ userId, productId, quantity: 1, color }).unwrap();
      toast.success(result.message);
      refetch();
    } catch (err) {
      toast.error("Failed to add item to cart");
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
    <div className="min-h-screen bg-white-50 my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-14 mx-auto max-w-7xl">
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              My Wishlist
            </h2>
            <div className="mt-2 sm:mt-0">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
          </div>

          {isWishlistEmpty ? (
            <Fallback
              isLoading={false}
              error={null}
              noUser={false}
              emptyMessage="Your wishlist is empty"
              emptyActionText="Continue Shopping"
              emptyActionPath="/shop"
              emptyIcon={<Heart />}
            />
          ) : (
            <div className="space-y-4 mt-6">
              {wishlistItems.map((item) => (
                <div
                  key={`${item.productId?._id}-${item.color}`}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col sm:flex-row sm:items-start sm:space-x-6 mb-4 animate-fade-in ${
                    !item.inStock ? "opacity-75 border border-red-300" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-sm flex-shrink-0 cursor-pointer mb-4 sm:mb-0"
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
                          className="text-base sm:text-lg font-semibold text-gray-800 cursor-pointer hover:text-orange-800"
                          onClick={() => handleProductClick(item.productId?._id)}
                        >
                          {item.productId?.name || "Unknown Product"}{" "}
                          <span className="text-xs sm:text-sm text-gray-500">({item.color})</span>
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.productId?._id, item.color)}
                          className="text-orange-800 hover:text-orange-900 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} className="sm:w-18 sm:h-18" />
                        </button>
                      </div>

                      {/* Stock Status */}
                      {!item.inStock && (
                        <p className="text-red-600 text-xs sm:text-sm mt-1">Out of Stock</p>
                      )}

                      {/* Price Information */}
                      <div className="flex items-center space-x-2 sm:space-x-3 mt-2 flex-wrap">
                        <p className="text-gray-800 font-semibold text-base sm:text-lg">
                          ₹{item.productId?.discountedPrice.toFixed(2)}
                        </p>
                        {item.price > item.discountedPrice && (
                          <>
                            <p className="text-gray-400 line-through text-xs sm:text-sm">
                              ₹{item.price.toFixed(2)}
                            </p>
                            <p className="text-green-600 text-xs sm:text-sm">
                              (
                              {Math.round(
                                ((item.price - item.discountedPrice) /
                                  item.price) *
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
                        className={`py-1 sm:py-2 px-3 sm:px-4 rounded-md flex items-center text-xs sm:text-sm transition-colors ${
                          item.inStock
                            ? "bg-orange-800/90 text-white hover:bg-orange-900"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={14} className="mr-1 sm:mr-2" />
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
              className="mt-6 w-full text-black-800 hover:text-orange-900 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
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