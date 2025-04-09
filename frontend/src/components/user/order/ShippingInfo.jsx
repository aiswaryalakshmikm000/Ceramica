import React from "react";

const ShippingInfo = ({ order }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium text-gray-700 mbnega-4 mb-2 border-b">Shipping Address</h3>
    <div className="text-sm text-gray-600 space-y-2">
      <p className="font-medium">{order.shippingAddress.fullName}</p>
      <p>{order.shippingAddress.addressLine}</p>
      <p>
        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
        {order.shippingAddress.pincode}
      </p>
      <p>{order.shippingAddress.phone}</p>
    </div>
  </div>
);

export default ShippingInfo;