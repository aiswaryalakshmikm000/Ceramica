

"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useGetTopProductsQuery } from "../../../features/adminAuth/adminDashboardApiSlice"

const TopProducts = ({ dateRange, filterType }) => {
  const [products, setProducts] = useState([])
  const [viewMode, setViewMode] = useState("table")

  // Format dates for API query
  const formattedStartDate = dateRange.startDate.toISOString().split("T")[0]
  const formattedEndDate = dateRange.endDate.toISOString().split("T")[0]

  // Fetch top products data
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetTopProductsQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    filterType,
    limit: 10,
  })

  useEffect(() => {
    console.log('TopProducts data:', productsData);
    if (productsData?.products) {
      setProducts(productsData.products)
    }
  }, [productsData])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#3c73a8]"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-sm sm:text-base">
        Error loading product data
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        No product data available for the selected period
      </div>
    )
  }

  const chartData = [...products].sort((a, b) => a.sales - b.sales)

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          <button
            className={`px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm ${viewMode === "table" ? "bg-[#3c73a8] text-white" : "bg-gray-100"}`}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
          <button
            className={`px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm ${viewMode === "chart" ? "bg-[#3c73a8] text-white" : "bg-gray-100"}`}
            onClick={() => setViewMode("chart")}
          >
            Chart
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 sm:px-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-2 py-2 sm:px-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-2 py-2 sm:px-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-2 py-2 sm:px-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-2 py-2 sm:px-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 sm:px-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-2 py-2 sm:px-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">{product.categoryName}</td>
                  <td className="px-2 py-2 sm:px-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">{product.sales}</td>
                  <td className="px-2 py-2 sm:px-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">
                    ₹{product.revenue.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">{product.totalStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={50} className="sm:text-xs" />
              <Tooltip formatter={(value) => [value, "Units Sold"]} />
              <Bar dataKey="sales" fill="#3c73a8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TopProducts