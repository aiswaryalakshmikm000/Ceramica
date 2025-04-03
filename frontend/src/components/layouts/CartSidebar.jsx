import React from "react";
import { X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/userAuthSlice";
import { useGetCartQuery } from "../../features/products/userProductApislice";

const CartSidebar = ({ isOpen, onClose }) => {
  const user = useSelector(selectUser);
  const userId = user?._id;

  // Fetch cart data using useGetCartQuery
  const { data: cart, isLoading, error } = useGetCartQuery(userId, {
    skip: !user, // Skip fetching if user is not authenticated
  });

  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    if (!cart || !cart.items) return "0.00";
    return cart.items
      .reduce((total, item) => total + item.latestPrice * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingCart size={24} className="text-ceramic-charcoal" />
              <h2 className="text-lg font-semibold text-ceramic-charcoal">
                Your Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-ceramic-charcoal hover:text-ceramic-earth"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-ceramic-charcoal">Loading cart...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-ceramic-charcoal">
                  Error loading cart: {error?.data?.message || error.message}
                </p>
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <ShoppingCart size={90} className="mx-auto text-gray-400" />
                <p className="mt-4 text-ceramic-charcoal">Your cart is empty</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}`}
                  className="flex items-center space-x-4 py-4 border-b"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-ceramic-charcoal">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.color} | {item.quantity} x ₹{item.latestPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-ceramic-charcoal">
                    ₹{(item.latestPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal and Buttons */}
          {isLoading || error ? null : !cart || cart.items.length === 0 ? (
            <div className="p-4 border-t">
              <Link
                to="/shop"
                onClick={onClose}
                className="block w-full text-center py-2 bg-ceramic-beige text-ceramic-charcoal rounded-md hover:bg-ceramic-earth transition-colors"
              >
                Return to Shop
              </Link>

              <Link
                to="/login"
                onClick={onClose}
                className="block border-t w-full text-center py-2 bg-ceramic-beige text-ceramic-charcoal rounded-md hover:bg-ceramic-earth transition-colors"
              >
                Return to login
              </Link>

            </div>
          ) : (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-ceramic-charcoal font-medium">
                  Subtotal:
                </span>
                <span className="text-ceramic-charcoal font-semibold">
                  ₹{calculateSubtotal()}
                </span>
              </div>
              <div className="space-y-2">
                <Link
                  to={`/cart/${userId}`}
                  onClick={onClose}
                  className="block w-full text-center py-2 border border-orange-600 rounded-lg text-orange-800 hover:bg-orange-50 transition-colors font-medium"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center py-2 bg-orange-800/90 text-white rounded-md hover:bg-orange-800 transition-colors font-medium"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;