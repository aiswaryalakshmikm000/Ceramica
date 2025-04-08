import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/input";
import { Download, ExternalLink } from "lucide-react";
import { toast } from "react-toastify"; 
import StatusBadge from "../../common/StatusBadge";
import Breadcrumbs from "../../common/BreadCrumbs";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCancelOrderItemMutation,
  useRequestReturnMutation,
  useRequestReturnItemMutation,
  useDownloadInvoiceQuery,
} from "../../../features/userAuth/userOrderApiSlice";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [returnReason, setReturnReason] = useState(""); 
  const [cancelReason, setCancelReason] = useState(""); 
  const [itemCancelReasons, setItemCancelReasons] = useState({});
  const [itemReturnReasons, setItemReturnReasons] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const { data: orderData, isLoading, isError, error, refetch } = useGetOrderByIdQuery(orderId);
  const order = orderData?.data;

  const [cancelOrder] = useCancelOrderMutation();
  const [cancelOrderItem] = useCancelOrderItemMutation();
  const [requestReturn] = useRequestReturnMutation();
  const [requestReturnItem] = useRequestReturnItemMutation();
  const { refetch: downloadInvoice } = useDownloadInvoiceQuery(orderId, { skip: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p>{error?.data?.message || "Order not found"}</p>
      </div>
    );
  }

  const status = order.status;
  const canCancel = status === "Pending" || status === "Confirmed";
  const canReturn = status === "Delivered";
  const isShipped = status === "Shipped" || status === "Out for Delivery";

  const handleItemCancel = async (itemId) => {
    const reason = itemCancelReasons[itemId];
    if (!reason?.trim()) {
      toast.error("Please provide a reason for cancelling this item", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      await cancelOrderItem({ orderId: order.orderNumber, itemId, cancelProductReason: reason }).unwrap();
      toast.success("Item cancelled successfully");
      setItemCancelReasons((prev) => ({ ...prev, [itemId]: "" }));
      setSelectedItemId(null); 
      refetch();
    } catch (err) {
      toast.error(`Failed to cancel item: ${err.data?.message || "Unknown error"}`);
    }
  };

  const handleItemReturn = async (itemId) => {
    const reason = itemReturnReasons[itemId];
    if (!reason?.trim()) {
      toast.error("Please provide a reason for returning this item", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      await requestReturnItem({ orderId: order.orderNumber, itemId, returnProductReason: reason }).unwrap();
      toast.success("Return request submitted for item");
      setItemReturnReasons((prev) => ({ ...prev, [itemId]: "" }));
      setSelectedItemId(null);
      refetch();
    } catch (err) {
      toast.error(`Failed to submit return request: ${err.data?.message || "Unknown error"}`);
    }
  };

  const handleReturn = async () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }
    try {
      await requestReturn({
        orderId: order.orderNumber,
        reason: returnReason,
      }).unwrap();
      toast.success(`Return request for order ${order.orderNumber} submitted`);
      setReturnReason("");
    } catch (err) {
      toast.error(`Failed to submit return request: ${err.data?.message || "Unknown error"}`);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    try {
      await cancelOrder({
        orderId: order.orderNumber,
        cancelReason,
      }).unwrap();
      toast.success(`Order ${order.orderNumber} cancelled successfully`);
      setCancelReason("");
    } catch (err) {
      toast.error(`Failed to cancel order: ${err.data?.message || "Unknown error"}`);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await downloadInvoice().unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Invoice for order ${order.orderNumber} has been downloaded`);
    } catch (err) {
      toast.error(`Failed to download invoice: ${err.data?.message || "Unknown error"}`);
    }
  };

  const toggleItemActions = (itemId) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId); 
  };

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Orders", href: "/orders" },
    { label: `Order #${order.orderNumber}`, href: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          {/* Order Status */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Order Status</h2>
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Download size={14} className="mr-1.5" />
                Download Invoice
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <p className="text-sm text-gray-500">
                Ordered on {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Shipping Address and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Shipping Address</h2>
              <div className="text-sm text-gray-600 border border-gray-200 rounded-md p-4">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Payment Information</h2>
              <div className="text-sm text-gray-600 border border-gray-200 rounded-md p-4">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tracking Number:</span>
                  <span>{order.trackingNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between font-medium py-2">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items in Order */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Items in Your Order</h2>
            <div className="space-y-3">
              {order.items.map((item) => {
                const itemStatus = item.status;
                const canCancelItem = itemStatus === "Pending" || itemStatus === "Confirmed";
                const canReturnItem = itemStatus === "Delivered";
                const isSelected = selectedItemId === item._id;

                return (
                  <div key={item._id} className="border border-gray-100 rounded-md p-3">
                    <div
                      className="flex cursor-pointer"
                      onClick={() => toggleItemActions(item._id)}
                    >
                      <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item?.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.target.src = "")}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/shop/${item.productId._id}`);
                          }}
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h4
                          className="text-sm font-medium"
                        >
                          {item.name} ({item.color})
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">₹{item.totalPrice}</p>
                        </div>
                        <div className="mt-1">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </div>

                    {/* Item Actions (shown only when clicked) */}
                    {isSelected && (canCancelItem || canReturnItem) && (
                      <div className="mt-2">
                        {(canCancelItem || canReturnItem) && (
                          <Textarea
                            placeholder={`Please provide a reason for ${
                              canCancelItem ? "cancelling" : "returning"
                            } this item...`}
                            value={
                              canCancelItem
                                ? itemCancelReasons[item._id] || ""
                                : itemReturnReasons[item._id] || ""
                            }
                            onChange={(e) =>
                              canCancelItem
                                ? setItemCancelReasons((prev) => ({
                                    ...prev,
                                    [item._id]: e.target.value,
                                  }))
                                : setItemReturnReasons((prev) => ({
                                    ...prev,
                                    [item._id]: e.target.value,
                                  }))
                            }
                            className="w-full mb-2"
                          />
                        )}
                        <div className="flex gap-2">
                          {canCancelItem && (
                            <Button
                              onClick={() => handleItemCancel(item._id)}
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-sm"
                              size="sm"
                            >
                              Cancel Item
                            </Button>
                          )}
                          {canReturnItem && (
                            <Button
                              onClick={() => handleItemReturn(item._id)}
                              className="bg-orange-800/90 hover:bg-orange-800 focus:ring-orange-800 text-sm"
                              size="sm"
                            >
                              Return Item
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Order Return and Cancel Textareas */}
          <div className="space-y-6 mb-6">
            {canReturn && (
              <div>
                <h2 className="text-lg font-medium mb-2">Return Order</h2>
                <Textarea
                  placeholder="Please explain the reason for your return..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full mb-2"
                />
              </div>
            )}
            {canCancel && (
              <div>
                <h2 className="text-lg font-medium mb-2">Cancel Full Order</h2>
                <Textarea
                  placeholder="Please share why you're cancelling this order..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full mb-2"
                />
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Back to Orders
            </Button>
            <div className="flex gap-2">
              {canReturn && (
                <Button
                  onClick={handleReturn}
                  className="bg-orange-800/90 hover:bg-orange-800 focus:ring-orange-800"
                >
                  Submit Return
                </Button>
              )}
              {canCancel && (
                <Button
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  Cancel Order
                </Button>
              )}
              {isShipped && (
                <Button variant="outline" size="sm">
                  <ExternalLink size={14} className="mr-1.5" />
                  Track Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;