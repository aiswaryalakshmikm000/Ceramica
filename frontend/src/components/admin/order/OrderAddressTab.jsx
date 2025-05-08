import React from 'react';

const OrderAddressTab = ({ order }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-600">{order.customerName}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.addressLine}</p>
        <p className="text-sm text-gray-600">
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
        <p className="text-sm text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
        <p className="text-sm text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
        <p className="text-sm text-gray-600 mt">Email: {order.shippingAddress.email}</p>
        <p className="text-sm text-gray-600 mt">Address Type: {order.shippingAddress.addressType}</p>
      </div>
    </div>
  );
};

export default OrderAddressTab;