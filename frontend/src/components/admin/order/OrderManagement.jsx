import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Eye } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import Breadcrumbs from '../../common/BreadCrumbs';
import Pagination from '../../common/Pagination';
import FilterSearchBar from './FilterSearchBar';
import StatusBadge from '../../common/StatusBadge';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useVerifyReturnRequestMutation,
} from '../../../features/adminAuth/adminOrderApiSlice';

const OrderManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // RTK Query hook for fetching orders
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sort: `${sortDirection === 'desc' ? '-' : ''}${sortField}`,
    status: filterStatus,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyReturnRequest] = useVerifyReturnRequestMutation();

  // Extract data from response
  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.totalPages || 1;
  const totalOrdersCount = ordersData?.totalOrdersCount || 0;

  console.log("OOOOOOOOOOOOOOOOOrder" , orders)
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Orders', href: '/admin/orders' },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (order_id, newStatus) => {
    try {
      await updateOrderStatus({ orderId: order_id, status: newStatus }).unwrap();
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleReturnAction = async (order_id, isApproved, refundToWallet) => {
    try {
      await verifyReturnRequest({
        orderId: order_id,
        isApproved,
        refundToWallet,
      }).unwrap();
      setIsModalOpen(false);
      setSelectedOrder(prev => prev ? { 
        ...prev, 
        status: isApproved ? 'Return-Approved' : 'Return-Rejected',
        returnRequest: { ...prev.returnRequest, isApproved }
      } : null);
      refetch();
    } catch (err) {
      console.error('Failed to process return:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Order Management</h1>
        <p className="text-gray-600">Manage customer orders, update status, and process returns</p>
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
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3c73a8] text-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortField === 'orderNumber' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUp size={16} className="ml-1" />
                      ) : (
                        <ArrowDown size={16} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderDate')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'orderDate' &&
                      (sortDirection === 'asc' ? (
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
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'totalAmount' &&
                      (sortDirection === 'asc' ? (
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.shippingAddress.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
          onStatusChange={handleStatusChange}
          onReturnApproval={handleReturnAction}
        />
      )}
    </div>
  );
};

export default OrderManagement;