import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  
  // Mock order ID 
  const orderId = `CER-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="min-h-screen bg-gray-50/50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
            <p className="font-medium">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - 
              {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/order-tracking")} // You can create this page next
            className="w-full flex items-center justify-center py-3 px-4 border border-orange-600 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <ShoppingBag size={18} className="mr-2" />
            Track Your Order
          </button>
          
          <button
            onClick={() => navigate("/shop")}
            className="w-full flex items-center justify-center py-3 px-4 bg-orange-800/90 hover:bg-orange-800 text-white rounded-lg transition-colors"
          >
            Continue Shopping
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;