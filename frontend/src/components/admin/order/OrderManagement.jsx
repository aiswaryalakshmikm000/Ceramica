import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from '../../common/Pagination';
import FilterSearchBar from './FilterSearchBar'; 
import StatusBadge from '../../common/StatusBadge'; 

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Dummy data (unchanged)
  const dummyOrders = [
    {
      id: 'ORD-001',
      orderDate: '2023-04-15T10:30:00',
      customer: { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', phone: '555-123-4567' },
      items: [
        { id: 'PROD-001', name: 'Ceramic Vase', price: 45.99, quantity: 2, image: '/images/vase.jpg' },
        { id: 'PROD-002', name: 'Ceramic Plate Set', price: 89.99, quantity: 1, image: '/images/plate-set.jpg' }
      ],
      totalAmount: 181.97,
      status: 'pending',
      paymentMethod: 'Credit Card',
      shippingAddress: { street: '123 Main St', city: 'Springfield', state: 'IL', zipCode: '62704', country: 'USA' },
      comment: ''
    },
    {
      id: 'ORD-002',
      orderDate: '2023-04-14T14:45:00',
      customer: { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543' },
      items: [{ id: 'PROD-003', name: 'Ceramic Mug', price: 24.99, quantity: 4, image: '/images/mug.jpg' }],
      totalAmount: 99.96,
      status: 'shipped',
      paymentMethod: 'PayPal',
      shippingAddress: { street: '456 Oak Ave', city: 'Portland', state: 'OR', zipCode: '97205', country: 'USA' },
      comment: ''
    },
    {
      id: 'ORD-003',
      orderDate: '2023-04-13T09:15:00',
      customer: { id: 'CUST-003', name: 'Robert Johnson', email: 'robert@example.com', phone: '555-456-7890' },
      items: [
        { id: 'PROD-004', name: 'Ceramic Bowl Set', price: 65.99, quantity: 1, image: '/images/bowl-set.jpg' },
        { id: 'PROD-005', name: 'Ceramic Teapot', price: 55.99, quantity: 1, image: '/images/teapot.jpg' }
      ],
      totalAmount: 121.98,
      status: 'delivered',
      paymentMethod: 'Credit Card',
      shippingAddress: { street: '789 Pine St', city: 'Boston', state: 'MA', zipCode: '02108', country: 'USA' },
      comment: ''
    },
    {
      id: 'ORD-004',
      orderDate: '2023-04-12T16:20:00',
      customer: { id: 'CUST-004', name: 'Emily Davis', email: 'emily@example.com', phone: '555-789-0123' },
      items: [{ id: 'PROD-006', name: 'Ceramic Flower Pot', price: 35.99, quantity: 3, image: '/images/flower-pot.jpg' }],
      totalAmount: 107.97,
      status: 'return-requested',
      paymentMethod: 'PayPal',
      shippingAddress: { street: '101 Maple Dr', city: 'Austin', state: 'TX', zipCode: '78701', country: 'USA' },
      comment: 'Product arrived damaged. Requesting return and refund.'
    },
    {
      id: 'ORD-005',
      orderDate: '2023-04-11T11:05:00',
      customer: { id: 'CUST-005', name: 'Michael Wilson', email: 'michael@example.com', phone: '555-321-6547' },
      items: [{ id: 'PROD-007', name: 'Ceramic Sculpture', price: 129.99, quantity: 1, image: '/images/sculpture.jpg' }],
      totalAmount: 129.99,
      status: 'cancelled',
      paymentMethod: 'Credit Card',
      shippingAddress: { street: '222 Cedar Ln', city: 'Seattle', state: 'WA', zipCode: '98101', country: 'USA' },
      comment: 'Customer requested cancellation before shipping'
    }
  ];

  useEffect(() => {
    let filteredOrders = [...dummyOrders];
    
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }
    
    filteredOrders.sort((a, b) => {
      if (sortField === 'orderDate') {
        return sortDirection === 'asc' 
          ? new Date(a.orderDate) - new Date(b.orderDate)
          : new Date(b.orderDate) - new Date(a.orderDate);
      } else if (sortField === 'totalAmount') {
        return sortDirection === 'asc'
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      } else if (sortField === 'id') {
        return sortDirection === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
      return 0;
    });
    
    setOrders(filteredOrders);
    setTotalPages(Math.ceil(filteredOrders.length / itemsPerPage) || 1);
  }, [searchTerm, filterStatus, sortField, sortDirection]);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Orders", href: "/admin/orders" },
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
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleReturnApproval = (orderId, approved, refundToWallet) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: approved ? 'return-approved' : 'return-rejected', refundToWallet: approved && refundToWallet }
        : order
    ));
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortField === 'id' && (sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orderDate')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'orderDate' && (sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'totalAmount' && (sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found</td></tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-gray-400">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
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
            totalItems={orders.length}
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
          onReturnApproval={handleReturnApproval}
        />
      )}
    </div>
  );
};

export default OrderManagement;