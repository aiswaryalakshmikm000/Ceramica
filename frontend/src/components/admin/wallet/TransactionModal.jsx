"use client";

import { X } from "lucide-react";

const TransactionModal = ({ isOpen, onClose, transaction, walletBalance, user }) => {
  if (!isOpen || !transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg my-4 sm:my-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Transaction Details</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Detailed information about this transaction</p>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Transaction ID</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {transaction.status}
            </span>
          </div>
          <p className="text-gray-700 break-all">{transaction.transactionId}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div>
            <h3 className="font-semibold">Date</h3>
            <p className="text-gray-700">{formatDate(transaction.createdAt)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Amount</h3>
            <p
              className={`text-gray-700 ${
                transaction.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.type === "credit" ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Type</h3>
          <p
            className={`text-gray-700 ${
              transaction.type === "credit" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </p>
        </div>

        <div className="mb-4 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">User Details</h3>
          <p>
            <span className="font-medium">Name:</span> {transaction.userId?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {transaction.userId?.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {transaction.userId?._id || "N/A"}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Transaction Source</h3>
          <p className="text-gray-700">{transaction.description}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;