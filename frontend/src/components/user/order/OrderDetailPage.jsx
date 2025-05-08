import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/input";
import { Download, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumbs from "../../common/BreadCrumbs";
import Fallback from "../../common/Fallback";
import OrderItems from "./OrderItems";
import OrderInfo from "./OrderInfo";
import ShippingInfo from "./ShippingInfo";
import PaymentInfo from "./PaymentInfo";
import ReturnSummary from "./ReturnSummary";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCancelOrderItemMutation,
  useRequestReturnMutation,
  useRequestReturnItemMutation,
  useDownloadInvoiceMutation,
} from "../../../features/userAuth/userOrderApiSlice";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [returnReason, setReturnReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [itemCancelReasons, setItemCancelReasons] = useState({});
  const [itemReturnReasons, setItemReturnReasons] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);

  const {
    data: orderData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId);
  const order = orderData?.data;

  const [cancelOrder] = useCancelOrderMutation();
  const [cancelOrderItem] = useCancelOrderItemMutation();
  const [requestReturn] = useRequestReturnMutation();
  const [requestReturnItem] = useRequestReturnItemMutation();
  const [downloadInvoice] = useDownloadInvoiceMutation();

  if (isLoading || isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-14 mx-auto max-w-7xl">
        <Fallback
          isLoading={isLoading}
          error={isError ? error : null}
          emptyMessage={
            !order && !isError && !isLoading ? "Order not found" : null
          }
          emptyActionText="Back to Orders"
          emptyActionPath="/orders"
        />
      </div>
    );
  }

  const status = order.status;
  const canCancel = status === "Pending" || status === "Payment-Pending" || status === "Confirmed";
  const canReturn = status === "Delivered";
  const isShipped = status === "Shipped" || status === "Out for Delivery";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      toast.error(
        `Failed to submit return request: ${
          err.data?.message || "Unknown error"
        }`
      );
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
      toast.error(
        `${err.data?.message || "Unknown error"}`
      );
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await downloadInvoice(orderId).unwrap();
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(
        `Invoice for order ${order.orderNumber} has been downloaded`
      );
    } catch (err) {
      toast.error(
        `Failed to download invoice: ${err.data?.message || "Unknown error"}`
      );
    }
  };

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Orders", href: "/orders" },
    { label: `#${order.orderNumber}`, href: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-14 mx-auto max-w-7xl">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {/* Top Section */}
        <div className="mb-6 border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Order #{order.orderNumber}
              </h1>
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="text-right space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                className="border-gray-200 hover:bg-gray-100 text-xs sm:text-sm"
              >
                <Download size={12} className="mr-1 sm:mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            <OrderItems
              order={order}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              itemCancelReasons={itemCancelReasons}
              setItemCancelReasons={setItemCancelReasons}
              itemReturnReasons={itemReturnReasons}
              setItemReturnReasons={setItemReturnReasons}
              cancelOrderItem={cancelOrderItem}
              requestReturnItem={requestReturnItem}
              refetch={refetch}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 sm:space-y-6">
              <OrderInfo order={order} />
              <PaymentInfo order={order} />
              <ShippingInfo order={order} />
            </div>
          </div>
        </div>

        {/* Return Summary */}
        <ReturnSummary order={order} formatDate={formatDate} />

        {/* Full Order Actions */}
        <div className="space-y-4 sm:space-y-6 py-4">
          {canReturn && (
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                Return Order
              </h3>
              <Textarea
                placeholder="Reason for return..."
                value={returnReason}
                rows={4}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full mb-2 border-gray-200 focus:ring-orange-800/30 text-sm sm:text-base"
              />
              <Button
                onClick={handleReturn}
                className="bg-orange-800/90 hover:bg-orange-800 mt-2 sm:mt-3 text-white text-xs sm:text-sm"
              >
                Submit Return
              </Button>
            </div>
          )}
          {canCancel && (
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                Cancel Order
              </h3>
              <Textarea
                placeholder="Reason for cancellation..."
                value={cancelReason}
                rows={4}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full mb-2 border-gray-200 focus:ring-orange-800/30 text-sm sm:text-base"
              />
              <Button
                onClick={handleCancel}
                className="bg-orange-800/90 hover:bg-orange-800 text-white text-xs sm:text-sm"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="border-gray-200 hover:bg-gray-100 text-xs sm:text-sm"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;