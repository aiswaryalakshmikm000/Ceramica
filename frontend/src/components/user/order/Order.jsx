
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, ChevronDown, ChevronUp, Download, 
  ExternalLink, Eye, ArrowLeft, ShoppingBag 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/Card.jsx"; 
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import StatusBadge from '../../common/StatusBadge'; 
import { toast } from "react-toastify";
import OrderDetailDialog from "./OrderDetailDialog";
import CancelOrderDialog from "./CancelOrder";
import ReturnOrderDialog from "./ReturnOrderDialog";
import Breadcrumbs from "../../common/BreadCrumbs.jsx"; 

const Order = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [modalState, setModalState] = useState({
    type: null, // 'detail', 'cancel', 'return'
    isOpen: false,
    order: null,
  });

  // Mock order data
  const orders = [
    {
      orderId: "CER-10045-2023",
      date: "April 15, 2023",
      status: "delivered",
      total: "₹2,899",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK764532198",
      shippingAddress: {
        fullName: "Rahul Sharma",
        addressLine: "123 Main Street, Apartment 4B",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        phone: "+91 98765 43210"
      },
      items: [
        {
          id: 1,
          name: "Handcrafted Ceramic Vase",
          price: "₹1,499",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "delivered"
        },
        {
          id: 2,
          name: "Ceramic Serving Plate",
          price: "₹1,399",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "delivered"
        }
      ]
    },
    {
      orderId: "CER-10039-2023",
      date: "April 10, 2023",
      status: "shipped",
      total: "₹3,699",
      paymentMethod: "UPI",
      trackingNumber: "TRK837645123",
      shippingAddress: {
        fullName: "Priya Patel",
        addressLine: "456 Park Avenue, Building C",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 98765 12345"
      },
      items: [
        {
          id: 3,
          name: "Ceramic Bowl Set (4 pieces)",
          price: "₹2,499",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1578873375969-d60aad647bb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "shipped"
        },
        {
          id: 4,
          name: "Ceramic Tea Cups (Set of 2)",
          price: "₹1,199",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "shipped"
        }
      ]
    },
    {
      orderId: "CER-10028-2023",
      date: "March 25, 2023",
      status: "pending",
      total: "₹4,499",
      paymentMethod: "Cash on Delivery",
      trackingNumber: "Pending",
      shippingAddress: {
        fullName: "Vikram Singh",
        addressLine: "789 Lake View, Floor 2",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91 87654 32109"
      },
      items: [
        {
          id: 5,
          name: "Large Decorative Ceramic Planter",
          price: "₹3,299",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "pending"
        },
        {
          id: 6,
          name: "Ceramic Chopstick Holders (Set of 4)",
          price: "₹1,199",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1525974160448-038dacadcc71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          status: "pending"
        }
      ]
    }
  ];

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal handlers
  const openModal = (type, order) => {
    setModalState({
      type,
      isOpen: true,
      order
    });
  };

  const closeModal = () => {
    setModalState({
      type: null,
      isOpen: false,
      order: null
    });
  };

  // Toggle order expansion
  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Download invoice handler
  const handleDownloadInvoice = (orderId) => {
    toast.success(`Invoice for order ${orderId} has been downloaded`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Orders", href: "/account/orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          <Card className="mb-8 border-none shadow-none">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by order ID or status..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredOrders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <div key={order.orderId} className="transition-colors">
                      <div 
                        className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50/50"
                        onClick={() => toggleOrderExpand(order.orderId)}
                      >
                        <div className="flex flex-col mb-3 md:mb-0">
                          <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-lg font-medium text-gray-900">{order.orderId}</span>
                            <StatusBadge status={order.status} /> 
                          </div>
                          <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center md:gap-3">
                            <span>Ordered on {order.date}</span>
                            <span className="hidden md:inline">•</span>
                            <span>{order.total}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('detail', order);
                            }}
                          >
                            <Eye size={14} className="mr-1.5" />
                            Details
                          </Button>
                          {expandedOrderId === order.orderId ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {expandedOrderId === order.orderId && (
                        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100">
                          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Payment Method</h4>
                              <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                            </div>
                            <div>
                              <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">Tracking Number</h4>
                              <p className="text-sm text-gray-900">{order.trackingNumber}</p>
                            </div>
                            <div className="flex justify-start md:justify-end items-center gap-3 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadInvoice(order.orderId);
                                }}
                              >
                                <Download size={14} className="mr-1.5" />
                                Invoice
                              </Button>
                              
                              {order.status === "shipped" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <ExternalLink size={14} className="mr-1.5" />
                                  Track
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-3 mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-start p-3 bg-white rounded-lg border border-gray-100">
                                <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "";
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
                          
                          <div className="flex flex-wrap gap-3 justify-start md:justify-end mt-4">
                            {order.status === "pending" && (
                              <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('cancel', order);
                                }}
                              >
                                Cancel Order
                              </Button>
                            )}
                            
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                className="border-amber-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('return', order);
                                }}
                              >
                                Return Order
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <ShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                  {searchQuery ? (
                    <p className="text-gray-500 mb-4">No orders match your search criteria.</p>
                  ) : (
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  )}
                  <Button onClick={() => navigate("/")}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modals */}
      {modalState.order && (
        <>
          <OrderDetailDialog 
            open={modalState.type === 'detail' && modalState.isOpen} 
            onOpenChange={(isOpen) => isOpen ? null : closeModal()} 
            order={modalState.order}
            onDownloadInvoice={() => handleDownloadInvoice(modalState.order.orderId)}
          />
          
          <CancelOrderDialog 
            open={modalState.type === 'cancel' && modalState.isOpen} 
            onOpenChange={(isOpen) => isOpen ? null : closeModal()} 
            order={modalState.order}
          />
          
          <ReturnOrderDialog 
            open={modalState.type === 'return' && modalState.isOpen} 
            onOpenChange={(isOpen) => isOpen ? null : closeModal()} 
            order={modalState.order}
          />
        </>
      )}
    </div>
  );
};

export default Order;
