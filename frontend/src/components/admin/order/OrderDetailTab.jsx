// OrderDetailsTab.js
import React from 'react';
import StatusBadge from '../../common/StatusBadge';

const OrderDetailsTab = ({ order, handleStatusChange, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order Date:</span> {formatDate(order.orderDate)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Method:</span> {order.paymentMethod}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Total Amount:</span> ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {order.shippingAddress.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
        <div className="mt-2">
          <select
            value={order.status}
            onChange={handleStatusChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#3c73a8] focus:border-[#3c73a8] sm:text-sm rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Payment-Pending">Payment Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTab;