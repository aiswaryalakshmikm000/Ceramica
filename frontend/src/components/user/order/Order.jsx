
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, ShoppingBag, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/Card.jsx";
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
        setFailedOrderId(orderNumber); // Set failed order ID
        setIsFailureModalOpen(true); // Open modal on failure
      }
    );
  };

  if (isLoading || isError || filteredOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
        <div className="px-24 mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
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
                    className="pl-10 w-full"
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
                        : "You haven't placed any orders yet."
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
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
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order.orderNumber} className="transition-colors">
                    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50/50">
                      <div className="flex flex-col mb-3 md:mb-0">
                        <div className="flex items-center gap-2 md:gap-4">
                          <span className="text-lg font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center md:gap-3">
                          <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                          <span className="hidden md:inline">•</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.orderNumber}`);
                          }}
                        >
                          <Eye size={14} className="mr-1.5" />
                          Details
                        </Button>

                        {(order.paymentStatus === "Pending" || order.paymentStatus === "Failed") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryPaymentModal(order);
                            }}
                            disabled={isRetryingPayment}
                          >
                            <RefreshCw size={14} className="mr-1.5" />
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
            <div className=" flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
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
            </div>
          )}
        </div>
      </div>

      {/* Render the Payment Failure Modal */}
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