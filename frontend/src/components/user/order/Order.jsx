import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../ui/Card.jsx";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import StatusBadge from "../../common/StatusBadge";
import Breadcrumbs from "../../common/BreadCrumbs.jsx";
import Fallback from "../../common/Fallback.jsx";
import Pagination from "../../common/Pagination.jsx";
import {
  useGetUserOrdersQuery,
  useRetryRazorpayPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} from '../../../features/userAuth/userOrderApiSlice.js';
import { toast } from "react-toastify";
import { selectUser } from "../../../features/userAuth/userAuthSlice.js";
import { useSelector } from "react-redux";
import { useRazorpay } from "react-razorpay";
import PaymentFailureModal from "../checkout/PaymentFailureModal.jsx";
import { handleRetryPayment } from "../../../services/retryRazorpayUtils.js";

const Order = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { Razorpay } = useRazorpay();
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [failedOrderId, setFailedOrderId] = useState(null); 

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserOrdersQuery({ page: currentPage, limit });

  const [retryRazorpayPayment, { isLoading: isRetryingPayment }] = useRetryRazorpayPaymentMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination || {
    totalOrders: 0,
    currentPage: 1,
    totalPages: 1,
    limit,
  };

  const { totalOrders, totalPages } = pagination;
  const totalItems = totalOrders;

  useEffect(() => {
    refetch();
  }, [refetch, currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Orders", href: "/account/orders" },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCloseModal = () => {
    setIsFailureModalOpen(false);
    setFailedOrderId(null);
  };

  const handleViewOrderDetails = () => {
    if (failedOrderId) {
      navigate(`/orders/${failedOrderId}`);
      handleCloseModal();
    }
  };

  const handleRetryPaymentModal = (order) => {
    handleRetryPayment(
      order,
      userId,
      Razorpay,
      verifyRazorpayPayment,
      retryRazorpayPayment,
      navigate,
      (orderNumber) => {
        setFailedOrderId(orderNumber);
        setIsFailureModalOpen(true);
      }
    );
  };

  if (isLoading || isError || filteredOrders.length === 0) {
    return (
      <div className="min-h-screen bg-white-50 my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-14 mx-auto max-w-7xl">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Orders</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          <Card className="mb-8 border-none shadow-none">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search by order number or status..."
                  className="pl-10 w-full text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Fallback
                isLoading={isLoading}
                error={isError ? error : null}
                emptyMessage={
                  filteredOrders.length === 0
                    ? searchQuery
                      ? "No orders match your search criteria."
                      : "You manufactures placed any orders yet."
                    : null
                }
                emptyActionText="Start Shopping"
                emptyActionPath="/shop"
                emptyIcon={<ShoppingBag />}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50 my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-14 mx-auto max-w-7xl">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Orders</h2>
        </div>
        <Breadcrumbs items={breadcrumbItems} />

        <Card className="mb-8 border-none shadow-none">
          <CardHeader className="pb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search by order number or status..."
                className="pl-10 w-full text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.orderNumber} className="transition-colors">
                  <div
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50/50"
                    onClick={() => navigate(`/orders/${order.orderNumber}`)}
                  >
                    <div className="flex flex-col mb-3 sm:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-base sm:text-lg font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                        <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {(order.paymentStatus === "Pending" || order.paymentStatus === "Failed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetryPaymentModal(order);
                          }}
                          disabled={isRetryingPayment}
                        >
                          <RefreshCw size={12} className="mr-1 sm:mr-1.5" />
                          {isRetryingPayment ? "Processing..." : "Retry Payment"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4">
            <div className="mb-4 sm:mb-0 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      <PaymentFailureModal
        isOpen={isFailureModalOpen}
        onClose={handleCloseModal}
        orderId={failedOrderId}
        onRetryPayment={() => handleRetryPaymentModal({ orderNumber: failedOrderId })}
        onViewOrderDetails={handleViewOrderDetails}
        isRetryingPayment={isRetryingPayment}
      />
    </div>
  );
};

export default Order;