
import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown } from "lucide-react";
import {
  useApplyCouponMutation,
  useGetUserCouponsQuery,
} from "../../../features/userAuth/userCouponApiSlice";
import { toast } from "react-toastify";

const OrderSummary = ({
  cart,
  activeStep,
  onNext,
  onBack,
  appliedCoupon,
  setAppliedCoupon,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [applyCouponMutation, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const { data: couponData, isLoading: isLoadingCoupons } = useGetUserCouponsQuery();

  // Ensure cart values are valid numbers
  const getSafeNumber = (value, defaultValue = 0) => {
    return isNaN(parseFloat(value)) ? defaultValue : parseFloat(value).toFixed(2);
  };

  // Use cart values safely
  const totalItems = cart?.totalItems || 0;
  const totalMRP = getSafeNumber(cart?.totalMRP);
  const totalDiscount = getSafeNumber(cart?.totalDiscount);
  const offerDiscount = getSafeNumber(cart?.offerDiscount || 0);
  const couponDiscount = getSafeNumber(appliedCoupon?.discount || 0);
  const deliveryCharge = getSafeNumber(cart?.deliveryCharge);
  const productDiscount = getSafeNumber(totalDiscount - offerDiscount);
  const subtotal = getSafeNumber(totalMRP - totalDiscount);
  const totalAmount = getSafeNumber(
    subtotal - couponDiscount + parseFloat(deliveryCharge)
  );

  // Filter active coupons
  const activeCoupons = couponData?.coupons?.filter(
    (coupon) => coupon.status === "active" && !coupon.isUsed && !coupon.isExpired
  ) || [];

  const handleApplyCoupon = async (code) => {
    if (!code.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError("");

    try {
      const response = await applyCouponMutation({ code }).unwrap();
      setAppliedCoupon(response.coupon);
      setCouponCode("");
      setCouponError("");
      setIsDropdownOpen(false);
      toast.success(response.message || "Coupon applied successfully");
    } catch (error) {
      console.error("Coupon Mutation Error:", error);
      setAppliedCoupon(null);
      setCouponCode("");
     
      setIsDropdownOpen(false);
      toast.error(error?.data?.message || "Failed to apply coupon");
    }
  };

  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.code);
    handleApplyCoupon(coupon.code);
  };

  const handleRemoveCoupon = async () => {
    try {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
      toast.success("Coupon removed successfully");
    } catch (error) {
      console.error("Remove Coupon Error:", error);
      toast.error(error?.data?.message || "Failed to remove coupon");
    }
  };

  const getButtonText = () => {
    switch (activeStep) {
      case 0:
        return "Continue to Payment";
      case 1:
        return "Review Order";
      case 2:
        return "Place Order";
      default:
        return "Continue";
    }
  };

  if (!cart) return null;

  return (
    <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>

      {/* Coupon Section */}
      {!appliedCoupon ? (
        <div className="mb-1 border-t py-5">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Apply Coupon (
              <a href="/coupons" className="text-orange-800 hover:underline">
                View Coupons
              </a>
              )
            </label>
            <div className="flex relative">
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
                disabled={isApplyingCoupon}
              />
              <button
                onClick={() => handleApplyCoupon(couponCode)}
                className="bg-orange-800/80 text-white px-4 py-2 hover:bg-orange-800 transition-colors disabled:bg-orange-600/70"
                disabled={isApplyingCoupon}
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="border border-gray-300 px-3 py-2 rounded-r-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200"
                disabled={isApplyingCoupon || isLoadingCoupons}
                aria-label="Toggle coupon dropdown"
              >
                <ChevronDown
                  size={16}
                  className={`text-gray-600 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {isLoadingCoupons ? (
                    <div className="p-4 text-gray-600 text-sm">Loading coupons...</div>
                  ) : activeCoupons.length > 0 ? (
                    activeCoupons.map((coupon) => (
                      <button
                        key={coupon._id}
                        onClick={() => handleSelectCoupon(coupon)}
                        className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm text-gray-700 flex justify-between items-center"
                        disabled={isApplyingCoupon}
                      >
                        <span>{coupon.code}</span>
                        <span className="text-gray-500">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountPercentage}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-gray-600 text-sm">
                      No active coupons available
                    </div>
                  )}
                </div>
              )}
            </div>
            {couponError && <p className="text-red-800 text-xs mt-1">{couponError}</p>}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-green-50 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle size={16} className="text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-800">{appliedCoupon.code} applied</p>
              <p className="text-xs text-green-600">You saved ₹{couponDiscount}</p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 focus:outline-none"
            disabled={isApplyingCoupon}
            aria-label="Remove coupon"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-4 text-gray-700 border-t py-5">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span>Original Price</span>
          <span>₹{totalMRP}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Product Discount</span>
          <span>-₹{productDiscount}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Offer Discount</span>
          <span>-₹{offerDiscount}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal (After Discount)</span>
          <span>₹{subtotal}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>-₹{couponDiscount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{deliveryCharge}</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-800">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
        {(parseFloat(productDiscount) > 0 || parseFloat(offerDiscount) > 0 || parseFloat(couponDiscount) > 0) && (
          <div className="bg-green-50 text-green-600 text-sm py-2 px-3 rounded-md">
            You have saved: ₹{getSafeNumber(parseFloat(productDiscount) + parseFloat(offerDiscount) + parseFloat(couponDiscount))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;