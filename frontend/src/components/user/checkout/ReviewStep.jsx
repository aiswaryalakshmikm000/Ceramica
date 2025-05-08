import React from "react";
import { ClipboardCheck, MapPin, CreditCard, Tag, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const ReviewStep = ({
  cart,
  address,
  paymentMethod,
  coupon,
  onBack,
  onPlaceOrder,
  isPlacingOrder,
}) => {
  const getPaymentMethodName = (methodId) => {
    switch (methodId) {
      case "Razorpay":
        return "Razorpay (UPI, Card, Net Banking)";
      case "Cash on Delivery":
        return "Cash on Delivery";
      case "Wallet":
        return "Wallet";
      default:
        return methodId || "Unknown";
    }
  };

  if (!cart || !address || !paymentMethod) {
    toast.error("Incomplete order details");
    return null;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <ClipboardCheck className="mr-2 text-orange-800 h-6 w-6 sm:h-8 sm:w-8" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Review Your Order</h2>
        </div>

        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="border-b pb-4">
            <div className="flex items-center mb-2">
              <MapPin size={16} className="text-orange-800 mr-2 sm:size-18" />
              <h3 className="font-medium text-base sm:text-lg">Shipping Address</h3>
            </div>
            <div className="ml-4 sm:ml-6 text-gray-600 text-sm sm:text-base">
              <p className="font-medium">{address?.fullName || address?.fullname}</p>
              <p>{address?.addressLine}{address?.landmark ? `, ${address.landmark}` : ""}</p>
              <p>{address?.city}, {address?.state} - {address?.pincode}</p>
              <p>Phone: {address?.phone}</p>
              <p>Email: {address?.email}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-b pb-4">
            <div className="flex items-center mb-2">
              <CreditCard size={16} className="text-orange-800 mr-2 sm:size-18" />
              <h3 className="font-medium text-base sm:text-lg">Payment Method</h3>
            </div>
            <div className="ml-4 sm:ml-6 text-gray-600 text-sm sm:text-base">
              <p>{getPaymentMethodName(paymentMethod)}</p>
            </div>
          </div>

          {/* Applied Coupon */}
          {coupon && (
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <Tag size={16} className="text-orange-800 mr-2 sm:size-18" />
                <h3 className="font-medium text-base sm:text-lg">Applied Coupon</h3>
              </div>
              <div className="ml-4 sm:ml-6 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 py-1 rounded">
                  {coupon.code}
                </span>
                <span className="text-green-600 text-xs sm:text-sm">
                  {coupon.discountType === "percentage"
                    ? `${coupon?.discountPercentage}% OFF`
                    : `₹${coupon.discount} OFF`}
                </span>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <div className="flex items-center mb-3">
              <ShoppingBag size={16} className="text-orange-800 mr-2 sm:size-18" />
              <h3 className="font-medium text-base sm:text-lg">Order Items ({cart.totalItems})</h3>
            </div>
            <div className="ml-4 sm:ml-6 space-y-3">
              {cart.items.map((item) => (
                <div
                  key={`${item.productId._id || item.productId}-${item.color}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-3 border-b border-gray-100"
                >
                  <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden mb-2 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.productId.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow sm:ml-4">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">{item.productId.name}</h4>
                    <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                      <span>Color: {item.color}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="font-semibold text-sm sm:text-base">₹{item.productId.discountedPrice}</p>
                    {item.productId.discount > 0 && (
                      <p className="text-xs sm:text-sm">
                        <span className="line-through text-gray-400">₹{item.productId.price}</span>
                        <span className="ml-1 text-green-600">{item.productId.discount}% off</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
            disabled={isPlacingOrder}
          >
            <ChevronLeft size={14} className="mr-1 " />
            Back to Payment
          </button>

          <button
            onClick={onPlaceOrder}
            className={`flex items-center px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto justify-center ${
              isPlacingOrder
                ? "bg-orange-600/70 cursor-not-allowed"
                : "bg-orange-800/90 hover:bg-orange-800 text-white"
            } transition-colors`}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              "Processing..."
            ) : (
              <>
                Place Order
                <ChevronRight size={14} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;