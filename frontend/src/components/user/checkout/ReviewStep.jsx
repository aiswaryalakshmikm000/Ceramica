
import React from "react";
import { ClipboardCheck, MapPin, CreditCard, Tag, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const ReviewStep = ({ 
  cart, 
  address, 
  paymentMethod, 
  coupon, 
  onBack, 
  onPlaceOrder 
}) => {
  // Payment method display name
  const getPaymentMethodName = (methodId) => {
    switch (methodId) {
      case "credit-card": return "Credit/Debit Card";
      case "upi": return "UPI Payment";
      case "cod": return "Cash on Delivery";
      default: return methodId;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <ClipboardCheck className="mr-2 text-orange-800" />
        <h2 className="text-2xl font-semibold text-gray-800">Review Your Order</h2>
      </div>

      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="border-b pb-4">
          <div className="flex items-center mb-2">
            <MapPin size={18} className="text-orange-800 mr-2" />
            <h3 className="font-medium">Shipping Address</h3>
          </div>
          <div className="ml-6 text-gray-600">
            <p className="font-medium">{address?.fullname}</p>
            <p>{address?.addressLine}{address?.landmark ? `, ${address.landmark}` : ""}</p>
            <p>{address?.city}, {address?.state} - {address?.pincode}</p>
            <p>Phone: {address?.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border-b pb-4">
          <div className="flex items-center mb-2">
            <CreditCard size={18} className="text-orange-800 mr-2" />
            <h3 className="font-medium">Payment Method</h3>
          </div>
          <div className="ml-6 text-gray-600">
            <p>{getPaymentMethodName(paymentMethod)}</p>
          </div>
        </div>

        {/* Applied Coupon */}
        {coupon && (
          <div className="border-b pb-4">
            <div className="flex items-center mb-2">
              <Tag size={18} className="text-orange-800 mr-2" />
              <h3 className="font-medium">Applied Coupon</h3>
            </div>
            <div className="ml-6 flex items-center">
              <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded">
                {coupon.code}
              </span>
              <span className="ml-2 text-green-600 text-sm">
                {coupon.discountType === "percentage" 
                  ? `${coupon.discount}% OFF` 
                  : `₹${coupon.discount} OFF`}
              </span>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <div className="flex items-center mb-3">
            <ShoppingBag size={18} className="text-orange-800 mr-2" />
            <h3 className="font-medium">Order Items ({cart.totalItems})</h3>
          </div>
          <div className="ml-6 space-y-3">
            {cart.items.map((item) => (
              <div 
                key={`${item.productId._id}-${item.color}`} 
                className="flex items-center py-3 border-b border-gray-100"
              >
                <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <div className="flex text-sm text-gray-500 space-x-4">
                    <span>Color: {item.color}</span>
                    <span>Quantity: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.latestPrice}</p>
                  {item.discount > 0 && (
                    <p className="text-sm">
                      <span className="line-through text-gray-400">₹{item.originalPrice}</span>
                      <span className="ml-1 text-green-600">{item.discount}% off</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Payment
        </button>
        
        <button
          onClick={onPlaceOrder}
          className="flex items-center px-6 py-2 bg-orange-800/90 text-white rounded-lg hover:bg-orange-800 transition-colors"
        >
          Place Order
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;