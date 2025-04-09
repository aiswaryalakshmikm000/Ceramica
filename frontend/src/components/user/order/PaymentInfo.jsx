import React from "react";

const PaymentInfo = ({ order }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium text-gray-700 mb-2 border-b">Payment Info</h3>
    <div className="text-sm text-gray-600 space-y-2">
      <div className="flex justify-between">
        <span>Method:</span>
        <span>{order.paymentMethod}</span>
      </div>
      <div className="flex justify-between">
        <span>Tracking:</span>
        <span>{order.trackingNumber || "N/A"}</span>
      </div>
      <div className="flex justify-between font-medium pt-2  border-gray-200">
        <span>Total:</span>
        <span>₹{order.totalAmount}</span>
      </div>
    </div>
  </div>
);

export default PaymentInfo;