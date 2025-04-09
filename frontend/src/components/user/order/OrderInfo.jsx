import React from "react";
import StatusBadge from "../../common/StatusBadge";

const OrderInfo = ({ order }) => {
  // Format date function to match your existing style
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-700 mb-2 border-b">Order Info</h3>
      <div className="text-sm text-gray-600 space-y-2">
        <div className="flex justify-between">
          <span>Status:</span>
          <span><StatusBadge status=  {order.status}/> </span>
        </div>
        <div className="flex justify-between">
          <span>Ordered On:</span>
          <span>{formatDate(order.orderDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Expected Delivery:</span>
          <span>
            {order.expectedDeliveryDate 
              ? formatDate(order.expectedDeliveryDate) 
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;