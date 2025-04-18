
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Eye } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
import FilterSearchBar from "./FilterSearchBar";
import StatusBadge from "../../common/StatusBadge";
import Fallback from "../../common/Fallback";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useVerifyReturnRequestMutation,
  useVerifyItemReturnRequestMutation,
} from "../../../features/adminAuth/adminOrderApiSlice";
import { toast } from "react-toastify";


const OrderManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
    status: filterStatus,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyReturnRequest] = useVerifyReturnRequestMutation();
  const [verifyItemReturnRequest] = useVerifyItemReturnRequestMutation();

  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.totalPages || 1;
  const totalOrdersCount = ordersData?.totalOrdersCount || 0;

  useEffect(() => {
    refetch();
  }, [
    refetch,
    itemsPerPage,
    currentPage,
    searchTerm,
    sortField,
    sortDirection,
    filterStatus,
  ]);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleViewOrder = (order) => {
    setSelectedOrderId(order._id); // Store only the ID
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus({
        orderId,
        status: newStatus,
      }).unwrap();
      refetch(); 
      toast.success(result.message || `Status Changed ${newStatus} succesfully`)
    } catch (err) {
      toast.error(err.data?.message || "Failed to change the status")
    }
  };

  const handleReturnAction = async (
    orderId,
    isApproved,
    refundToWallet,
    adminComment
  ) => {
    try {
      const result = await verifyReturnRequest({
        orderId,
        isApproved,
        refundToWallet,
        adminComment,
      }).unwrap();
      setIsModalOpen(false);
      refetch(); 
      toast.success(result.message || "Return varified")
    } catch (err) {
      toast.error(err.data?.message || "Unknown error");
    }
  };

  const handleItemReturnAction = async (
    orderId,
    itemId,
    isApproved,
    refundToWallet,
    adminComment
  ) => {
    try {
      const result = await verifyItemReturnRequest({
        orderId,
        itemId,
        isApproved,
        refundToWallet,
        adminComment,
      }).unwrap();
      refetch(); 
      toast.success(result.message || "Item Return varified")
    } catch (err) {
      toast.error(err.data?.message || "Unknown error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || error) {
    return (
      <Fallback
        isLoading={isLoading}
        error={error}
        emptyMessage={null}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">
          Order Management
        </h1>
        <p className="text-gray-600">
          Manage customer orders, update status, and process returns
        </p>
      </div>

      <FilterSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortField={sortField}
        sortDirection={sortDirection}
        setSortField={setSortField}
        setSortDirection={setSortDirection}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        refetch={refetch}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[rgb(60,115,168)] text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("orderNumber")}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortField === "orderNumber" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={16} className="ml-1" />
                      ) : (
                        <ArrowDown size={16} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("orderDate")}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === "orderDate" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={16} className="ml-1" />
                      ) : (
                        <ArrowDown size={16} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("totalAmount")}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === "totalAmount" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp size={16} className="ml-1" />
                      ) : (
                        <ArrowDown size={16} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <Fallback emptyMessage="No orders found" />
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-gray-400">
                        {order.shippingAddress.email}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-[#3c73a8] hover:text-[#2c5580] flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOrdersCount}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          orderId={selectedOrderId} 
          onStatusChange={handleStatusChange}
          onReturnApproval={handleReturnAction}
          onItemReturnApproval={handleItemReturnAction}
        />
      )}
    </div>
  );
};

export default OrderManagement;