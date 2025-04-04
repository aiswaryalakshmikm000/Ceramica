
import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const OrderSummary = ({ 
  cart, 
  coupon, 
  onApplyCoupon, 
  onRemoveCoupon, 
  activeStep,
  onNext,
  onBack,
  // onPlaceOrder
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Calculate discounted price with coupon
  const calculateTotal = () => {
    if (!cart) return { subtotal: 0, discount: 0, total: 0 };
    
    let subtotal = cart.items.reduce(
      (acc, item) => acc + item.latestPrice * item.quantity, 
      0
    );
    
    let couponDiscount = 0;
    if (coupon) {
      if (coupon.discountType === "percentage") {
        couponDiscount = (subtotal * coupon.discount) / 100;
      } else {
        couponDiscount = coupon.discount;
      }
    }
    
    const total = subtotal + cart.deliveryCharge + cart.platformFee - couponDiscount;
    
    return {
      subtotal: subtotal.toFixed(2),
      couponDiscount: couponDiscount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const { subtotal, couponDiscount, total } = calculateTotal();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    // Here you would typically validate the coupon with an API
    if (couponCode.toUpperCase() === "CERAMICA50") {
      onApplyCoupon(couponCode.toUpperCase());
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon code");
    }
  };

  const getButtonText = () => {
    switch (activeStep) {
      case 0: return "Continue to Payment";
      case 1: return "Review Order";
      case 2: return "Place Order";
      default: return "Continue";
    }
  };
  
  const handleButtonClick = () => {
    if (activeStep === 2) {
      onPlaceOrder();
    } else {
      onNext();
    }
  };

  if (!cart) return null;

  return (
    <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Order Summary
      </h2>
      
      {/* Coupon Section */}
      {!coupon ? (
        <div className="mb-1 border-t py-5">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Apply Coupon</label>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                }}
                placeholder="Enter coupon code"
                className={`flex-grow border ${
                  couponError ? "border-red-800" : "border-gray-300"
                } rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-800/50`}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-orange-800/80 text-white px-3 py-2 rounded-r-lg hover:bg-orange-800 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-red-800 text-xs mt-1">{couponError}</p>
            )}
            <p className="text-xs text-gray-500">
              Try coupon code: CERAMICA50 for ₹50 off
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-green-50 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle size={16} className="text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-800">{coupon.code} applied</p>
              <p className="text-xs text-green-600">
                You saved ₹{couponDiscount}
              </p>
            </div>
          </div>
          <button
            onClick={onRemoveCoupon}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}
      
      {/* Price Breakdown */}
      <div className="space-y-4 text-gray-700 border-t py-5">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{cart.totalItems}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Product Discount</span>
          <span>-₹{cart.totalDiscount?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Original Price</span>
          <span>₹{cart.totalMRP?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal (After Discount)</span>
          <span>₹{subtotal}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>-₹{couponDiscount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{cart.deliveryCharge?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>₹{cart.platformFee?.toFixed(2)}</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-800">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>
        <div className="bg-green-50 text-green-700 text-sm py-2 px-3 rounded-md">
          You have saved: ₹{(parseFloat(cart.totalDiscount) + parseFloat(couponDiscount)).toFixed(2)}
        </div>
      </div>
{/* 
      <button 
        onClick={handleButtonClick}
        className="w-full mt-6 bg-orange-800/90 hover:bg-orange-800 text-white py-3 rounded-lg transition-colors font-medium"
      >
        {getButtonText()}
      </button>

      {activeStep > 0 && (
        <button
          onClick={onBack}
          className="w-full mt-3 text-orange-600 hover:text-orange-700 py-2 rounded-lg transition-colors font-medium"
        >
          Back to {activeStep === 1 ? "Address" : "Payment"}
        </button>
      )} */}
    </div>
  );
};

export default OrderSummary;