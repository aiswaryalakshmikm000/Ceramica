
import React, { useState } from 'react';
import { X, Package, MapPin, FileText } from 'lucide-react';
import OrderDetailsTab from './OrderDetailTab';
import OrderItemsTab from './OrderItemstab';
import OrderAddressTab from './OrderAddressTab';
import OrderActionsTab from './OrderActionsTab';
import { useGetOrderDetailsQuery } from '../../../features/adminAuth/adminOrderApiSlice';

const OrderDetailModal = ({ isOpen, onClose, orderId, onStatusChange, onReturnApproval, onItemReturnApproval }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [adminComments, setAdminComments] = useState({});
  const [refundToWallet, setRefundToWallet] = useState(true);
  

  const {data, isLoading, error } = useGetOrderDetailsQuery(orderId,{
    skip: !isOpen || !orderId
  });

  const order = data?.data

  if (!isOpen || !order) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg z-10 p-6">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg z-10 p-6 text-red-600">
          Error loading order details: {error.data?.message || error.message}
        </div>
      </div>
    );
  }

if (!order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg z-10 p-6">Order not found</div>
      </div>
    );
  }


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

  const handleStatusChange = (e) => {
    onStatusChange(order._id, e.target.value);
  };

  const handleReturnAction = (isApproved) => {
    const adminComment = adminComments['fullOrder'] || '';
    onReturnApproval(order._id, isApproved, refundToWallet, adminComment);
  };

  const handleReturnItemAction = (itemId, isApproved, refundToWallet) => {
    const adminComment = adminComments[itemId] || '';
    onItemReturnApproval(order._id, itemId, isApproved, refundToWallet, adminComment );
  };

  const handleAdminCommentChange = (key, value) => {
    setAdminComments((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-4xl h-[500px] mx-4 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#3c73a8] text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'details' ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' : 'text-gray-500 hover:text-[#3c73a8]'}`}
            onClick={() => setActiveTab('details')}
          >
            <FileText className="h-4 w-4" />
            Quick Details
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'items' ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' : 'text-gray-500 hover:text-[#3c73a8]'}`}
            onClick={() => setActiveTab('items')}
          >
            <Package className="h-4 w-4" />
            Items
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'address' ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' : 'text-gray-500 hover:text-[#3c73a8]'}`}
            onClick={() => setActiveTab('address')}
          >
            <MapPin className="h-4 w-4" />
            Address
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'actions' ? 'border-b-2 border-[#3c73a8] text-[#3c73a8]' : 'text-gray-500 hover:text-[#3c73a8]'}`}
            onClick={() => setActiveTab('actions')}
          >
            <FileText className="h-4 w-4" />
            Actions
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'details' && (
            <OrderDetailsTab 
              order={order} 
              handleStatusChange={handleStatusChange} 
              formatDate={formatDate} 
            />
          )}
          {activeTab === 'items' && (<OrderItemsTab order={order} />)}
          {activeTab === 'address' && (<OrderAddressTab order={order} />)}
          {activeTab === 'actions' && (
            <OrderActionsTab
              order={order}
              formatDate={formatDate}
              adminComments={adminComments}
              handleAdminCommentChange={handleAdminCommentChange}
              refundToWallet={refundToWallet}
              setRefundToWallet={setRefundToWallet}
              handleReturnAction={handleReturnAction}
              handleReturnItemAction={handleReturnItemAction}
            />
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