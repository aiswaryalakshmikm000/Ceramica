import React from "react";
import { X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CartSidebar = ({ isOpen, onClose }) => {
  const cartItems = useSelector(state => state.cart?.items) || [];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={onClose}
        />
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
              <h2 className="text-lg font-semibold text-ceramic-charcoal">Your Cart</h2>
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
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={40} className="mx-auto text-gray-400" />
                <p className="mt-4 text-ceramic-charcoal">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-ceramic-charcoal">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-ceramic-charcoal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal and Buttons */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-ceramic-charcoal font-medium">Subtotal:</span>
                <span className="text-ceramic-charcoal font-semibold">${calculateSubtotal()}</span>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full text-center py-2 mb-2 bg-ceramic-beige text-ceramic-charcoal rounded-md hover:bg-ceramic-earth transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center py-2 bg-ceramic-earth text-white rounded-md hover:bg-ceramic-charcoal transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;