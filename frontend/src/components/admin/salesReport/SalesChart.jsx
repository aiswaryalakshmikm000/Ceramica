"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

const SalesChart = ({ data, type }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create a deep copy of the data to avoid mutating the original
    const chartData = JSON.parse(JSON.stringify(data))

    // Create new chart
    const ctx = chartRef.current.getContext("2d")

    // Configure chart based on type
    const chartConfig = {
      type: type === "pie" ? "pie" : type,
      data: chartData, 
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== undefined) {
                  label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    context.parsed.y
                  )
                } else if (context.parsed !== undefined) {
                  label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(context.parsed)
                }
                return label
              },
            },
          },
        },
      },
    }

    // Special configuration for pie chart
    if (type === "pie") {
      // For pie chart, transform the data to show totals
      const totalSales = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0)
      const totalDiscounts = chartData.datasets[1].data.reduce((sum, val) => sum + val, 0)
      const totalCoupons = chartData.datasets[2].data.reduce((sum, val) => sum + val, 0)

      chartConfig.data = {
        labels: ["Sales", "Discounts", "Coupon Discounts"],
        datasets: [
          {
            data: [totalSales, totalDiscounts, totalCoupons],
            backgroundColor: ["rgba(60, 115, 168, 0.7)", "rgba(255, 99, 132, 0.7)", "rgba(255, 206, 86, 0.7)"],
            borderColor: ["rgba(60, 115, 168, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
            borderWidth: 1,
          },
        ],
      }
    }

    chartInstance.current = new Chart(ctx, chartConfig)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default SalesChart