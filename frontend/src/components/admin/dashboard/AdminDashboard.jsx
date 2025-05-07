
// "use client";

// import { useState, useEffect } from "react";
// import SalesOverview from "./SalesOverview";
// import TopProducts from "./TopProducts";
// import TopCategories from "./TopCategories";
// import { DollarSign, ShoppingBag, Users, Tag } from "lucide-react";
// import { useGetDashboardStatsQuery, useGetTopCategoriesQuery } from "../../../features/adminAuth/adminDashboardApiSlice";
// import Breadcrumbs from "../../common/Breadcrumbs";

// const AdminDashboard = () => {
//   const [filterType, setFilterType] = useState("weekly");
//   const [stats, setStats] = useState({
//     totalSales: 0,
//     totalOrders: 0,
//     activeUsers: 0,
//   });

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

//   // Fetch dashboard stats
//   const {
//     data: statsData,
//     isLoading: statsLoading,
//     isError: statsError,
//   } = useGetDashboardStatsQuery({
//     startDate: formattedStartDate,
//     endDate: formattedEndDate,
//     filterType,
//   });

//   // Fetch top category with filterType
//   const {
//     data: categoriesData,
//     isLoading: categoriesLoading,
//     isError: categoriesError,
//   } = useGetTopCategoriesQuery({
//     startDate: formattedStartDate,
//     endDate: formattedEndDate,
//     filterType,
//     limit: 1,
//   });

//   useEffect(() => {
//     if (statsData) {
//       setStats({
//         totalSales: statsData.netSales || 0,
//         totalOrders: statsData.totalOrders || 0,
//         activeUsers: statsData.activeUsers || 0,
//       });
//     }
//   }, [statsData]);

//   const handleFilterTypeChange = (type) => {
//     setFilterType(type);
//   };

//   const breadcrumbItems = [
//     { label: "Admin", href: "/admin" },
//     { label: "Dashboard", href: "/admin/dashboard" },
//   ];

//   if (statsLoading || categoriesLoading) {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
//           <p className="text-gray-500">Loading dashboard...</p>
//         </main>
//       </div>
//     );
//   }

//   if (statsError || categoriesError) {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
//           <p className="text-red-500">Error loading dashboard</p>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <main className="flex-1 p-6 overflow-y-auto">
//         <div className="mb-6">
//           <Breadcrumbs items={breadcrumbItems} />
//           <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Dashboard</h1>
//           <p className="text-gray-600">View and analyze key metrics and performance</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
//                 <h3 className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</h3>
//               </div>
//               <div className="p-2 bg-blue-50 rounded-full">
//                 <DollarSign className="h-5 w-5 text-[#3c73a8]" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Orders</p>
//                 <h3 className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</h3>
//               </div>
//               <div className="p-2 bg-purple-50 rounded-full">
//                 <ShoppingBag className="h-5 w-5 text-purple-500" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Active Customers</p>
//                 <h3 className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</h3>
//               </div>
//               <div className="p-2 bg-green-50 rounded-full">
//                 <Users className="h-5 w-5 text-green-500" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Best Selling Category</p>
//                 <h3 className="text-2xl font-bold">
//                   {categoriesData?.categories?.[0]?.name || "N/A"}
//                 </h3>
//               </div>
//               <div className="p-2 bg-orange-50 rounded-full">
//                 <Tag className="h-5 w-5 text-orange-500" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <SalesOverview filterType={filterType} onFilterTypeChange={handleFilterTypeChange} />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Best Selling Products</h2>
//             </div>
//             <TopProducts dateRange={dateRange} filterType={filterType} />
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Best Selling Categories</h2>
//             </div>
//             <TopCategories dateRange={dateRange} filterType={filterType} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;




"use client";

import { useState, useEffect } from "react";
import SalesOverview from "./SalesOverview";
import TopProducts from "./TopProducts";
import TopCategories from "./TopCategories";
import { DollarSign, ShoppingBag, Users, Tag } from "lucide-react";
import { useGetDashboardStatsQuery, useGetTopCategoriesQuery } from "../../../features/adminAuth/adminDashboardApiSlice";
import Breadcrumbs from "../../common/Breadcrumbs";

const AdminDashboard = () => {
  const [filterType, setFilterType] = useState("weekly");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
  });

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
        startDate.setDate(endDate.getDate() - 7); 
    }

    return {
      startDate,
      endDate,
    };
  };

  const dateRange = getDateRange();
  const formattedStartDate = dateRange.startDate.toISOString().split("T")[0];
  const formattedEndDate = dateRange.endDate.toISOString().split("T")[0];

  // Fetch dashboard stats
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetDashboardStatsQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    filterType,
  },
  {
    // Force re-fetch when parameters change
    refetchOnMountOrArgChange: true,
  });

  // Fetch top category with filterType
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetTopCategoriesQuery({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    filterType,
    limit: 1,
  });

  useEffect(() => {
    console.log('statsData:', statsData);
    if (statsData) {
      setStats({
        totalSales: statsData.netSales || 0,
        totalOrders: statsData.totalOrders || 0,
        activeUsers: statsData.activeUsers || 0,
      });
    }
  }, [statsData]);

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
  };

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Dashboard", href: "/admin/dashboard" },
  ];

  if (statsLoading || categoriesLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
          <p className="text-gray-500 text-sm sm:text-base">Loading dashboard...</p>
        </main>
      </div>
    );
  }

  if (statsError || categoriesError) {
    return (
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500 text-sm sm:text-base">Error loading dashboard</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-xl sm:text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and analyze key metrics and performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-xl sm:text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#3c73a8]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold">{stats.totalOrders.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-full">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Active Customers</p>
                <h3 className="text-xl sm:text-2xl font-bold">{stats.activeUsers.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Best Selling Category</p>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {categoriesData?.categories?.[0]?.name || "N/A"}
                </h3>
              </div>
              <div className="p-2 bg-orange-50 rounded-full">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <SalesOverview filterType={filterType} onFilterTypeChange={handleFilterTypeChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Best Selling Products</h2>
            </div>
            <TopProducts dateRange={dateRange} filterType={filterType} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Best Selling Categories</h2>
            </div>
            <TopCategories dateRange={dateRange} filterType={filterType} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;