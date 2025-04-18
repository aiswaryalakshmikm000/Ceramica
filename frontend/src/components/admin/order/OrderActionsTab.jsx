
import React, { useState } from 'react';
import { CheckCircle, XCircle, Wallet } from 'lucide-react';
import { Textarea } from '../../ui/input';

const OrderActionsTab = ({
  order,
  formatDate,
  adminComments,
  handleAdminCommentChange,
  refundToWallet,
  setRefundToWallet,
  handleReturnAction,
  handleReturnItemAction,
}) => {
  const [itemRefundToWallet, setItemRefundToWallet] = useState({});

  const handleItemRefundChange = (itemId, checked) => {
    setItemRefundToWallet((prev) => ({ ...prev, [itemId]: checked }));
  };

  return (
    <div className="space-y-6">
      {/* Full Order Return Request */}
      {order.returnRequest.isRequested && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Full Order Return Request</h3>
          <div className="mt-2 bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-gray-700">{order.returnRequest.reason}</p>
          </div>
          {order.status === 'Return-Requested' && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Process Full Order Return</h3>
              <Textarea
                value={adminComments['fullOrder'] || ''}
                onChange={(e) => handleAdminCommentChange('fullOrder', e.target.value)}
                rows={5}
                className="mt-2 shadow-sm focus:ring-[#3c73a8]/30 focus:border-[#3c73a8]/30 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add a comment for this order return..."
              />
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={refundToWallet}
                    onChange={(e) => setRefundToWallet(e.target.checked)}
                    className="h-4 w-4 text-[#3c73a8]/30 focus:ring-[#3c73a8]/30 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                    <Wallet className="h-4 w-4 mr-1" />
                    Refund amount to customer wallet
                  </span>
                </label>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleReturnAction(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Return
                </button>
                <button
                  onClick={() => handleReturnAction(false)}
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

      {/* Individual Item Return Requests */}
      <div>
        <h3 className="text-sm font-medium text-gray-500">Individual Item Return Requests</h3>
        {order.items.some((item) => item.returnRequest?.isRequested) ? (
          order.items.map((item) =>
            item.returnRequest?.isRequested ? (
              <div key={item._id} className="mt-4 bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900">{item.name} ({item.color})</h4>
                <p className="text-sm text-gray-700 mt-4">Reason: {item.returnRequest.reason}</p>
                {item.returnRequest.isApproved !== null && (
                  <p className="text-sm text-gray-600 mt-1">
                    Status: {item.returnRequest.isApproved ? 'Approved' : 'Rejected'} on{' '}
                    {formatDate(item.returnRequest.approvedAt)}
                  </p>
                )}
                {item.returnRequest.adminComment && (
                  <p className="text-sm text-gray-600 mt-1">
                    Admin Comment: {item.returnRequest.adminComment}
                  </p>
                )}
                {item.status === 'Return-Requested' && (
                  <div className="mt-2">
                    <Textarea
                      value={adminComments[item._id] || ''}
                      onChange={(e) => handleAdminCommentChange(item._id, e.target.value)}
                      rows={5}
                      className="mt-2 p-4 shadow-sm focus:ring-[#3c73a8] focus:border-[#3c73a8] block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Add a comment for this item return..."
                    />
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={itemRefundToWallet[item._id] || false}
                          onChange={(e) => handleItemRefundChange(item._id, e.target.checked)}
                          className="h-4 w-4 text-[#3c73a8]/30 focus:ring-[#3c73a8]/30 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                          <Wallet className="h-4 w-4 mr-1" />
                          Refund item amount to customer wallet
                        </span>
                      </label>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() =>
                          handleReturnItemAction(item._id, true, itemRefundToWallet[item._id] || false, adminComments[item._id] || "")
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleReturnItemAction(item._id, false, itemRefundToWallet[item._id] ||false, adminComments[item._id] || "")
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null
          )
        ) : (
          <p className="text-sm text-gray-600 mt-2">No return requests.</p>
        )}
      </div>
    </div>
  );
};

export default OrderActionsTab;