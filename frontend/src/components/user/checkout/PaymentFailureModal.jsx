import React from "react";
import { X, Eye, RefreshCw } from "lucide-react";

const PaymentFailureModal = ({
  isOpen,
  onClose,
  orderId,
  onRetryPayment,
  onViewOrderDetails,
  isRetryingPayment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment for order #{orderId}. Please try again or check your order details.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onRetryPayment}
            className={`px-6 py-2 rounded-lg text-white ${
              isRetryingPayment
                ? "bg-orange-600/70 cursor-not-allowed"
                : "bg-orange-800 hover:bg-orange-900"
            } transition-colors`}
            disabled={isRetryingPayment}
          >
            {isRetryingPayment ? "Processing..." : "Retry Payment"}
          </button>
          <button
            onClick={onViewOrderDetails}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureModal;