

import React from "react";
import { useNavigate } from "react-router-dom";
import { useValidateCheckoutMutation } from "../../../features/userAuth/userCartApislice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Correct way to access environment variables in Vite
const THRESHOLD_AMOUNT = import.meta.env.VITE_THRESHOLD_AMOUNT 

const CartOrderSummary = ({ cart, subtotal, isCartEmpty, totalAmount, setProblematicItems }) => {

  const navigate = useNavigate();
  const [validateCheckout, { isLoading }] = useValidateCheckoutMutation();

  const handleCheckout = async () => {
    try {
      const result = await validateCheckout().unwrap();
      if (result.success) {
        navigate("/checkout");
      }
    } catch (error) {
      if (error.status === 400) {
        const { outOfStockItems = [], unlistedItems = [] } = error.data.data || {};
        setProblematicItems({ outOfStockItems, unlistedItems });
        toast.error(error.data.message);
      } else {
        toast.error("Failed to validate cart for checkout");
      }
    }
  };

  const hasProblems = cart.items.some(item => !item.inStock || (item.productId && !item.productId.isListed));
  const remainingForFreeDelivery = THRESHOLD_AMOUNT - totalAmount;

  // Animation variants for the free delivery message
  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Order Summary
        </h2>
        {remainingForFreeDelivery > 0 && !isCartEmpty && (
          <motion.p 
            className="text-m font-medium font:semibold text-red-500 text-center mt-3 bg-orange-50 py-2 px-3 rounded-md"
            variants={pulseAnimation}
            animate="animate"
          >
            Order for ₹{remainingForFreeDelivery.toFixed(2)} more for free delivery
          </motion.p>
        )}
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
              {/* <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{cart.platformFee.toFixed(2)}</span>
              </div> */}
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
          onClick={handleCheckout}
          className={`w-full mt-6 py-3 rounded-lg text-white font-medium transition-colors ${
            isCartEmpty || isLoading || hasProblems
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-800 hover:bg-orange-900"
          }`}
          disabled={isCartEmpty || isLoading || hasProblems}
        >
          {isLoading ? "Checking..." : "Proceed to Checkout"}
        </button>
        
      </div>
    </div>
  );
};

export default CartOrderSummary;