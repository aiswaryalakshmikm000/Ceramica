import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Eye } from "lucide-react";

const Orders = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Mock order data
  const orders = [
    {
      id: "ORD-3892-4902",
      date: "June 12, 2023",
      status: "Delivered",
      total: "$189.99",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK928374651",
      items: [
        {
          id: 1,
          name: "Handcrafted Ceramic Mug",
          price: "$29.99",
          quantity: 2,
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 2,
          name: "Ceramic Flower Pot",
          price: "$49.99",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 3,
          name: "Ceramic Serving Plate",
          price: "$79.99",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        }
      ]
    },
    {
      id: "ORD-2573-9183",
      date: "May 28, 2023",
      status: "Processing",
      total: "$95.99",
      paymentMethod: "PayPal",
      trackingNumber: "TRK837465123",
      items: [
        {
          id: 4,
          name: "Ceramic Bowl Set (4 pieces)",
          price: "$79.99",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1578873375969-d60aad647bb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 5,
          name: "Ceramic Chopstick Holder",
          price: "$15.99",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1525974160448-038dacadcc71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        }
      ]
    },
    {
      id: "ORD-9284-3572",
      date: "April 15, 2023",
      status: "Delivered",
      total: "$129.99",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK764532198",
      items: [
        {
          id: 6,
          name: "Ceramic Vase",
          price: "$129.99",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        }
      ]
    }
  ];

  const toggleOrderExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">My Orders</h1>
      
      <div className="max-w-4xl mx-auto">
        {orders.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {orders.map((order) => (
              <div key={order.id} className="border-b border-gray-200 last:border-b-0">
                <div 
                  className="p-4 flex flex-wrap items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="w-full md:w-auto mb-2 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    <div className="text-sm font-medium">{order.total}</div>
                    <button className="text-gray-500">
                      {expandedOrderId === order.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedOrderId === order.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Payment Method</h4>
                        <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Tracking Number</h4>
                        <p className="text-sm text-gray-900">{order.trackingNumber}</p>
                      </div>
                      <div className="flex justify-start md:justify-end items-center">
                        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                          <Eye size={16} className="mr-1" />
                          View Invoice
                        </button>
                        {order.status === "Shipped" || order.status === "Delivered" ? (
                          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center ml-4">
                            <ExternalLink size={16} className="mr-1" />
                            Track Package
                          </button>
                        ) : null}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                          <div className="h-16 w-16 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900">{item.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 inline-flex items-center">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;