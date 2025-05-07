
"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGetTopCategoriesQuery } from "../../../features/adminAuth/adminDashboardApiSlice"

const TopCategories = ({ dateRange, filterType }) => {
  const [categories, setCategories] = useState([])
  const [viewMode, setViewMode] = useState("chart")

  const COLORS = [
    "#3c73a8",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#6366f1",
    "#f97316",
  ]

  // Format dates for API query
  const formattedStartDate = dateRange.startDate.toISOString().split("T")[0]
  const formattedEndDate = dateRange.endDate.toISOString().split("T")[0]

  // Fetch top categories data
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetTopCategoriesQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    filterType,
    limit: 10,
  })

  useEffect(() => {
    console.log('TopCategories data:', categoriesData);
    if (categoriesData?.categories) {
      setCategories(categoriesData.categories)
    }
  }, [categoriesData])

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
        Error loading category data
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        No category data available for the selected period
      </div>
    )
  }

  const chartData = [...categories].sort((a, b) => b.sales - a.sales)
  const totalSales = chartData.reduce((sum, category) => sum + category.sales, 0)

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
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">{category.sales}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">
                    ₹{category.revenue.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">
                    {((category.sales / totalSales) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="sales"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} units (${((value / totalSales) * 100).toFixed(1)}%)`,
                  props.payload.name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} className="sm:text-xs" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TopCategories