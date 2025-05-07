
"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  RefreshCcw,
  X,
  Eye,
} from "lucide-react";
import Breadcrumbs from "../../common/Breadcrumbs";
import TransactionModal from "./TransactionModal";
import Pagination from "../../common/Pagination";
import { useGetAdminWalletQuery, useGetWalletTransactionsQuery } from "../../../features/adminAuth/adminWalletApiSlice";

const WalletListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [limit, setLimit] = useState(10); 
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: walletData, isLoading: isWalletLoading } = useGetAdminWalletQuery();
  const { data: transactionsData, isLoading: isTransactionsLoading } = useGetWalletTransactionsQuery({
    page: currentPage,
    limit: limit,
    search: searchTerm,
    type: typeFilter,
  });

  const walletBalance = walletData?.balance || 0;
  const transactions = transactionsData?.transactions || [];
  const totalPages = transactionsData?.pages || 1;
  const totalItems = transactionsData?.total || 0;
  const itemsPerPage = limit;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); 
    } else if (totalPages === 0) {
      setCurrentPage(1); 
    }
  }, [totalPages, currentPage, searchTerm, typeFilter, limit]);

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setLimit(10);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeIcon = (type) => {
    if (type === "credit") {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    } else if (type === "debit") {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    } else {
      return <ArrowUpRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const paginatedTransactions = transactions;

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Wallet", href: "/admin/wallet" },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div className="mb-6">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Wallet Management</h1>
      <p className="text-gray-600">Manage customer wallet balances and transactions</p>
    </div>

    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div className="flex items-center">
          <div className="bg-[#3c73a8] p-3 rounded-full">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Total Wallet Balance</h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{walletBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col  sm:flex-row sm:items-center gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by transaction ID, customer, or order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent w-full sm:w-auto"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCcw size={18} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#3c73a8] text-white">
            <tr>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Sr No
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isTransactionsLoading ? (
              <tr>
                <td colSpan="7" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 sm:px-6 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <tr key={transaction.transactionId} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index+1}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{transaction.userId?.name || "N/A"}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.transactionType}
                    {transaction.type && (
                      <span className="text-sm text-[#3c73a8]"> ({transaction.type})</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      {getTransactionTypeIcon(transaction.type)}
                      <span className={transaction.type === "credit" ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                        {transaction.type === "credit" ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="text-[#3c73a8] hover:text-[#2a5b8e]"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section with Showing X to Y of Z */}
      {totalPages > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>

    <TransactionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      transaction={selectedTransaction}
      walletBalance={walletBalance}
    />
  </div>
);
};


export default WalletListing;