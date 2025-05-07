

// "use client";

// import { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { BarChart4, LineChartIcon, PieChartIcon } from "lucide-react";
// import { useGetSalesDataQuery } from "../../../features/adminAuth/adminDashboardApiSlice";

// const COLORS = ["#3c73a8", "#f87171", "#fb923c", "#facc15"];

// const SalesOverview = ({ filterType, onFilterTypeChange }) => {
//   const [chartType, setChartType] = useState("bar");
//   const [chartData, setChartData] = useState([]);

//   // Calculate date range based on filterType
//   const getDateRange = () => {
//     const endDate = new Date();
//     let startDate = new Date();

//     switch (filterType) {
//       case "daily":
//         startDate.setDate(endDate.getDate() - 1);
//         break;
//       case "weekly":
//         startDate.setDate(endDate.getDate() - 7);
//         break;
//       case "monthly":
//         startDate.setMonth(endDate.getMonth() - 1);
//         break;
//       case "yearly":
//         startDate.setFullYear(endDate.getFullYear() - 1);
//         break;
//       default:
//         startDate.setDate(endDate.getDate() - 7); // Default to weekly
//     }

//     return {
//       startDate,
//       endDate,
//     };
//   };

//   const dateRange = getDateRange();
//   const formattedStartDate = dateRange.startDate.toISOString().split("T")[0];
//   const formattedEndDate = dateRange.endDate.toISOString().split("T")[0];

//   // Fetch sales data from API
//   const {
//     data: salesData,
//     isLoading,
//     isError,
//     error,
//   } = useGetSalesDataQuery({
//     startDate: formattedStartDate,
//     endDate: formattedEndDate,
//     filterType,
//   });

//   // Update chart data when API data changes
//   useEffect(() => {
//     if (salesData && salesData.labels && salesData.datasets) {
//       const mappedData = salesData.labels.map((label, index) => {
//         return {
//           name: label,
//           sales: salesData.datasets[0].data[index] || 0,
//           productsDiscount: salesData.datasets[1].data[index] || 0,
//           offerDiscount: salesData.datasets[2].data[index] || 0,
//           couponDiscount: salesData.datasets[3].data[index] || 0,
//         };
//       });
//       setChartData(mappedData);
//     } else {
//       setChartData([]);
//     }
//   }, [salesData]);

//   // Format currency for tooltip
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   // Custom tooltip for charts
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
//           <p className="font-semibold">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ color: entry.color }}>
//               {entry.name}: {formatCurrency(entry.value)}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Prepare data for pie chart
//   const getPieChartData = () => {
//     if (!chartData.length) return [];

//     const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
//     const totalProductsDiscount = chartData.reduce((sum, item) => sum + item.productsDiscount, 0);
//     const totalOfferDiscount = chartData.reduce((sum, item) => sum + item.offerDiscount, 0);
//     const totalCouponDiscount = chartData.reduce((sum, item) => sum + item.couponDiscount, 0);

//     return [
//       { name: "Sales", value: totalSales },
//       { name: "Products Discounts", value: totalProductsDiscount },
//       { name: "Offer Discounts", value: totalOfferDiscount },
//       { name: "Coupon Discounts", value: totalCouponDiscount },
//     ].filter((item) => item.value > 0);
//   };

//   // Custom label for pie chart
//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
//     const RADIAN = Math.PI / 180;
//     const radius = outerRadius * 1.1;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill={COLORS[index % COLORS.length]}
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         fontSize={12}
//       >
//         {`${name} (${(percent * 100).toFixed(0)}%)`}
//       </text>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-gray-500">
//         Loading sales data...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-64 text-red-500">
//         Error loading sales data: {error?.data?.message || "Unknown error"}
//       </div>
//     );
//   }

//   if (!chartData || chartData.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64 text-gray-500">
//         No data available for the selected period
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Sales Overview</h2>
//         <div className="flex items-center gap-2">
//           <div className="flex border border-gray-300 rounded-md overflow-hidden">
//             {["daily", "weekly", "monthly", "yearly"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => onFilterTypeChange(type)}
//                 className={`px-3 py-1.5 text-sm ${
//                   filterType === type
//                     ? "bg-[#3c73a8] text-white"
//                     : "bg-white text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </button>
//             ))}
//           </div>
//           <div className="flex border border-gray-300 rounded-md overflow-hidden">
//             <button
//               onClick={() => setChartType("bar")}
//               className={`p-1.5 ${
//                 chartType === "bar" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//               title="Bar Chart"
//             >
//               <BarChart4 size={16} />
//             </button>
//             <button
//               onClick={() => setChartType("line")}
//               className={`p-1.5 ${
//                 chartType === "line" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//               title="Line Chart"
//             >
//               <LineChartIcon size={16} />
//             </button>
//             <button
//               onClick={() => setChartType("pie")}
//               className={`p-1.5 ${
//                 chartType === "pie" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//               title="Pie Chart"
//             >
//               <PieChartIcon size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           {chartType === "bar" ? (
//             <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Bar dataKey="sales" name="Sales" fill="#3c73a8" />
//               <Bar dataKey="productsDiscount" name="Products Discounts" fill="#f87171" />
//               <Bar dataKey="offerDiscount" name="Offer Discounts" fill="#fb923c" />
//               <Bar dataKey="couponDiscount" name="Coupon Discounts" fill="#facc15" />
//             </BarChart>
//           ) : chartType === "line" ? (
//             <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="sales"
//                 name="Sales"
//                 stroke="#3c73a8"
//                 strokeWidth={2}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="productsDiscount"
//                 name="Products Discounts"
//                 stroke="#f87171"
//                 strokeWidth={2}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="offerDiscount"
//                 name="Offer Discounts"
//                 stroke="#fb923c"
//                 strokeWidth={2}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="couponDiscount"
//                 name="Coupon Discounts"
//                 stroke="#facc15"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           ) : (
//             <PieChart>
//               <Pie
//                 data={getPieChartData()}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={true}
//                 label={renderCustomizedLabel}
//                 outerRadius={120}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {getPieChartData().map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => formatCurrency(value)} />
//               <Legend />
//             </PieChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default SalesOverview;




"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart4, LineChartIcon, PieChartIcon } from "lucide-react";
import { useGetSalesDataQuery } from "../../../features/adminAuth/adminDashboardApiSlice";

const COLORS = ["#3c73a8", "#f87171", "#fb923c", "#facc15"];

const SalesOverview = ({ filterType, onFilterTypeChange }) => {
  const [chartType, setChartType] = useState("bar");
  const [chartData, setChartData] = useState([]);

  // Calculate date range based on filterType
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    switch (filterType) {
      case "daily":
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7); // Default to weekly
    }

    return {
      startDate,
      endDate,
    };
  };

  const dateRange = getDateRange();
  const formattedStartDate = dateRange.startDate.toISOString().split("T")[0];
  const formattedEndDate = dateRange.endDate.toISOString().split("T")[0];

  // Fetch sales data from API
  const {
    data: salesData,
    isLoading,
    isError,
    error,
  } = useGetSalesDataQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    filterType,
  });

  // Update chart data when API data changes
  useEffect(() => {
    if (salesData && salesData.labels && salesData.datasets) {
      const mappedData = salesData.labels.map((label, index) => {
        return {
          name: label,
          sales: salesData.datasets[0].data[index] || 0,
          productsDiscount: salesData.datasets[1].data[index] || 0,
          offerDiscount: salesData.datasets[2].data[index] || 0,
          couponDiscount: salesData.datasets[3].data[index] || 0,
        };
      });
      setChartData(mappedData);
    } else {
      setChartData([]);
    }
  }, [salesData]);

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-sm sm:text-base">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs sm:text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Prepare data for pie chart
  const getPieChartData = () => {
    if (!chartData.length) return [];

    const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
    const totalProductsDiscount = chartData.reduce((sum, item) => sum + item.productsDiscount, 0);
    const totalOfferDiscount = chartData.reduce((sum, item) => sum + item.offerDiscount, 0);
    const totalCouponDiscount = chartData.reduce((sum, item) => sum + item.couponDiscount, 0);

    return [
      { name: "Sales", value: totalSales },
      { name: "Products Discounts", value: totalProductsDiscount },
      { name: "Offer Discounts", value: totalOfferDiscount },
      { name: "Coupon Discounts", value: totalCouponDiscount },
    ].filter((item) => item.value > 0);
  };

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
        className="sm:text-xs"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        Loading sales data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-sm sm:text-base">
        Error loading sales data: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm sm:text-base">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Sales Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex border border-gray-300 rounded-md overflow-hidden flex-wrap sm:flex-nowrap">
            {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => onFilterTypeChange(type)}
                className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm ${
                  filterType === type
                    ? "bg-[#3c73a8] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setChartType("bar")}
              className={`p-1 sm:p-1.5 ${
                chartType === "bar" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              title="Bar Chart"
            >
              <BarChart4 size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-1 sm:p-1.5 ${
                chartType === "line" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              title="Line Chart"
            >
              <LineChartIcon size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`p-1 sm:p-1.5 ${
                chartType === "pie" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              title="Pie Chart"
            >
              <PieChartIcon size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} className="sm:text-xs" />
              <Bar dataKey="sales" name="Sales" fill="#3c73a8" />
              <Bar dataKey="productsDiscount" name="Products Discounts" fill="#f87171" />
              <Bar dataKey="offerDiscount" name="Offer Discounts" fill="#fb923c" />
              <Bar dataKey="couponDiscount" name="Coupon Discounts" fill="#facc15" />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} className="sm:text-xs" />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#3c73a8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="productsDiscount"
                name="Products Discounts"
                stroke="#f87171"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="offerDiscount"
                name="Offer Discounts"
                stroke="#fb923c"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="couponDiscount"
                name="Coupon Discounts"
                stroke="#facc15"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={getPieChartData()}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: 10 }} className="sm:text-xs" />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOverview;