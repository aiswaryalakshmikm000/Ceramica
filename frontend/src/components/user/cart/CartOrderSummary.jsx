import React from "react";
import { useNavigate } from "react-router-dom";

const CartOrderSummary = ({ cart, subtotal, isCartEmpty, totalAmount }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Order Summary
        </h2>
        <div className="space-y-4 text-gray-700 border-t py-6">
          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{cart.totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Original Price</span>
            <span>₹{cart.totalMRP.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total Discount</span>
            <span>-₹{cart.totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {!isCartEmpty && (
            <>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{cart.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{cart.platformFee.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="pt-4 border-t border-gray-200 flex justify-between font-semibold text-lg text-gray-800">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="bg-green-50 text-green-700 text-sm py-2 px-3 rounded-md">
            You save: ₹{cart.totalDiscount.toFixed(2)}
          </div>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-6 bg-orange-800 hover:bg-orange-900 text-white py-3 rounded-lg transition-colors font-medium"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartOrderSummary;