import React from 'react';
import { X, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-3000 ease-in-out"
        style={{ opacity: isOpen ? 0.5 : 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-white rounded-lg shadow-2xl w-11/12 max-w-md p-6 absolute right-4 ${
          isOpen
            ? 'animate__animated animate__slideInUp animate__slower top-[25%] opacity-100'
            : 'top-[100vh] opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Unlock Exclusive Benefits!
        </h2>

        {/* Promotional Content */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Login now to enjoy exclusive offers, save items to your wishlist, and add them to your cart effortlessly!
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                <Heart size={20} className="text-orange-600" />
              </span>
              <span className="text-sm text-gray-700">Wishlist</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                <ShoppingCart size={20} className="text-orange-600" />
              </span>
              <span className="text-sm text-gray-700">Add to Cart</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="w-full flex items-center justify-center py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-semibold"
          onClick={() => navigate('/login')}
        >
          Login Now
          <ArrowRight className="ml-2" size={20} />
        </button>

        {/* Optional: Continue as Guest */}
        <button
          className="w-full mt-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          onClick={onClose}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;