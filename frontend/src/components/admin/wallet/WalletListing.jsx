"use client"

import { useState, useEffect } from "react"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  RefreshCcw,
  X,
} from "lucide-react"
import Breadcrumbs from "../../common/BreadCrumbs" 

const WalletListing = () => {
  const [transactions, setTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)

  // Dummy data for wallet transactions
  const dummyTransactions = [
    {
      id: "TRX-001",
      date: "2023-04-15T10:30:00",
      type: "refund",
      amount: 181.97,
      status: "completed",
      orderId: "ORD-004",
      customer: {
        id: "CUST-004",
        name: "Emily Davis",
      },
      description: "Refund for returned order #ORD-004",
    },
    {
      id: "TRX-002",
      date: "2023-04-14T14:45:00",
      type: "refund",
      amount: 99.96,
      status: "completed",
      orderId: "ORD-007",
      customer: {
        id: "CUST-007",
        name: "Thomas Wilson",
      },
      description: "Refund for returned order #ORD-007",
    },
    {
      id: "TRX-003",
      date: "2023-04-13T09:15:00",
      type: "withdrawal",
      amount: -250.0,
      status: "completed",
      customer: {
        id: "CUST-004",
        name: "Emily Davis",
      },
      description: "Customer withdrawal to bank account",
    },
    {
      id: "TRX-004",
      date: "2023-04-12T16:20:00",
      type: "refund",
      amount: 45.99,
      status: "pending",
      orderId: "ORD-012",
      customer: {
        id: "CUST-012",
        name: "Sarah Johnson",
      },
      description: "Pending refund for returned order #ORD-012",
    },
    {
      id: "TRX-005",
      date: "2023-04-11T11:05:00",
      type: "adjustment",
      amount: 50.0,
      status: "completed",
      customer: {
        id: "CUST-008",
        name: "Michael Brown",
      },
      description: "Manual adjustment - Customer service goodwill",
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      let filteredTransactions = [...dummyTransactions]

      if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) =>
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transaction.orderId && transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      }

      if (dateFilter !== "all") {
        const now = new Date()
        let startDate

        if (dateFilter === "today") {
          startDate = new Date(now.setHours(0, 0, 0, 0))
        } else if (dateFilter === "week") {
          startDate = new Date(now.setDate(now.getDate() - 7))
        } else if (dateFilter === "month") {
          startDate = new Date(now.setMonth(now.getMonth() - 1))
        }

        filteredTransactions = filteredTransactions.filter((transaction) => new Date(transaction.date) >= startDate)
      }

      if (typeFilter !== "all") {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.type === typeFilter)
      }

      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))

      setTransactions(filteredTransactions)
      setTotalPages(Math.ceil(filteredTransactions.length / 10) || 1)

      const balance = dummyTransactions.reduce((total, transaction) => total + transaction.amount, 0)
      setWalletBalance(balance)

      setIsLoading(false)
    }, 500)
  }, [searchTerm, dateFilter, typeFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setDateFilter("all")
    setTypeFilter("all")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionTypeIcon = (type, amount) => {
    if (type === "refund" || amount > 0) {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    } else {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const paginatedTransactions = transactions.slice((currentPage - 1) * 10, currentPage * 10)

  // Breadcrumbs data
  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Wallet", href: "/admin/wallet" },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Wallet Management</h1>
        <p className="text-gray-600">Manage customer wallet balances and transactions</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-[#3c73a8] p-3 rounded-full">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Wallet Balance</h2>
              <p className="text собі-3xl font-bold text-gray-900">${walletBalance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3c73a8]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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

          <div className="flex gap-4 flex-wrap">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="refund">Refunds</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="adjustment">Adjustments</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2"
            >
              <RefreshCcw size={18} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3c73a8] text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{transaction.customer.name}</div>
                      <div className="text-xs text-gray-400">ID: {transaction.customer.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                      {transaction.orderId && <span className="text-xs text-[#3c73a8]"> ({transaction.orderId})</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        {getTransactionTypeIcon(transaction.type, transaction.amount)}
                        <span className={transaction.amount > 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * 10, transactions.length)}</span> of{" "}
                <span className="font-medium">{transactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "z-10 bg-[#3c73a8] border-[#3c73a8] text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletListing