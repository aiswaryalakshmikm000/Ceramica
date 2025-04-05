import React, { useState } from 'react';
import { X, Package, MapPin, FileText, CheckCircle, XCircle, Truck, ShoppingBag, Clock, AlertCircle, Wallet } from 'lucide-react';

const OrderDetailModal = ({ isOpen, onClose, order, onStatusChange, onReturnApproval }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [adminComment, setAdminComment] = useState('');
  const [refundToWallet, setRefundToWallet] = useState(true);
  
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'out-for-delivery':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'return-requested':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'return-approved':
        return <CheckCircle className="h-5 w-5 text-teal-500" />;
      case 'return-rejected':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleStatusChange = (e) => {
    onStatusChange(order.id, e.target.value);
  };

  const handleApproveReturn = () => {
    onReturnApproval(order.id, true, refundToWallet);
  };

  const handleRejectReturn = () => {
    onReturnApproval(order.id, false, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#3c73a8] text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Order {order.id}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'details' 
                ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' 
                : 'text-gray-500 hover:text-[#3c73a8]'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <FileText className="h-4 w-4" />
            Quick Details
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'items' 
                ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' 
                : 'text-gray-500 hover:text-[#3c73a8]'
            }`}
            onClick={() => setActiveTab('items')}
          >
            <Package className="h-4 w-4" />
            Items
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'address' 
                ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' 
                : 'text-gray-500 hover:text-[#3c73a8]'
            }`}
            onClick={() => setActiveTab('address')}
          >
            <MapPin className="h-4 w-4" />
            Address
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'actions' 
                ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' 
                : 'text-gray-500 hover:text-[#3c73a8]'
            }`}
            onClick={() => setActiveTab('actions')}
          >
            <FileText className="h-4 w-4" />
            Actions
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto">
          {/* Quick Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                    <div className="mt-2 bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium capitalize">
                          {order.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Order Date:</span> {formatDate(order.orderDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Amount:</span> ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                    <div className="mt-2 bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {order.customer.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {order.customer.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                <div className="mt-2">
                  <select
                    value={order.status}
                    onChange={handleStatusChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#3c73a8] focus:border-[#3c73a8] sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="return-requested">Return Requested</option>
                    <option value="return-approved">Return Approved</option>
                    <option value="return-rejected">Return Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-md object-cover" src={item.image || '/placeholder.svg'} alt={item.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">SKU: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-sm text-gray-600 mt-2">Phone: {order.customer.phone}</p>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              {/* Customer Comment */}
              {order.comment && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Comment</h3>
                  <div className="mt-2 bg-yellow-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">{order.comment}</p>
                  </div>
                </div>
              )}

              {/* Admin Comment */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Admin Comment</h3>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                  className="mt-2 shadow-sm focus:ring-[#3c73a8] focus:border-[#3c73a8] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add a comment about this order..."
                />
              </div>

              {/* Return Request Actions */}
              {order.status === 'return-requested' && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Return Request</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This order has a return request. Please review and take action.
                  </p>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={refundToWallet}
                        onChange={(e) => setRefundToWallet(e.target.checked)}
                        className="h-4 w-4 text-[#3c73a8] focus:ring-[#3c73a8] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <Wallet className="h-4 w-4 mr-1" />
                        Refund amount to customer wallet
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleApproveReturn}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Return
                    </button>
                    <button
                      onClick={handleRejectReturn}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
