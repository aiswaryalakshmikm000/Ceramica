import React from "react";
import { Trash2 } from "lucide-react";

const OrderItem = ({ item }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-start space-x-6 mb-4 animate-fade-in"
    >
      {/* Item Image */}
      <div className="w-32 h-32 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full justify-between">
        <div>
          <h5 className="text-lg font-semibold text-gray-800">{item.name}</h5>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            <p className="text-gray-800 font-semibold text-lg">{item.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;