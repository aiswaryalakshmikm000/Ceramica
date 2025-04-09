// OrderItemsTab.js
import React from 'react';
import StatusBadge from "../../common/StatusBadge";

const OrderItemsTab = ({ order }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-15 w-15 rounded-md object-cover" src={item.image} alt={item.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 py-1">{item.name} ({item.color})</div>
                      <div className="text-sm text-gray-500">SKU: {item._id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <StatusBadge status= {item.status}/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{item.latestPrice.toFixed(2)}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{(item.latestPrice * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="4" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Total:
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
              ₹{order.totalAmount.toFixed(0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsTab;