// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Search, Eye, ShoppingBag } from "lucide-react";
// import { Card, CardContent, CardHeader } from "../../ui/Card.jsx";
// import { Button } from "../../ui/button";
// import { Input } from "../../ui/input";
// import StatusBadge from "../../common/StatusBadge";
// import Breadcrumbs from "../../common/BreadCrumbs.jsx";
// import { useGetUserOrdersQuery } from '../../../features/userAuth/userOrderApiSlice.js'; 

// const Order = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Fetch orders using the RTK Query hook
//   const { data: ordersData, isLoading, isError, error } = useGetUserOrdersQuery();

//   // Extract orders from the response (adjust based on your API response structure)
//   const orders = ordersData?.data || [];

//   // Filter orders based on search query
//   const filteredOrders = orders.filter(
//     (order) =>
//       order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.status.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Define breadcrumb items
//   const breadcrumbItems = [
//     { label: "My Account", href: "" },
//     { label: "Orders", href: "/account/orders" },
//   ];

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
//         <p>Loading orders...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
//         <p>Error fetching orders: {error?.data?.message || "Something went wrong"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
//       <div className="px-24 mx-auto">
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
//           </div>
//           <Breadcrumbs items={breadcrumbItems} />

//           <Card className="mb-8 border-none shadow-none">
//             <CardHeader className="pb-4">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <Input
//                   type="text"
//                   placeholder="Search by order number or status..."
//                   className="pl-10 w-full"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </CardHeader>

//             <CardContent className="p-0">
//               {filteredOrders.length > 0 ? (
//                 <div className="divide-y divide-gray-100">
//                   {filteredOrders.map((order) => (
//                     <div key={order.orderNumber} className="transition-colors">
//                       <div
//                         className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50/50"
//                       >
//                         <div className="flex flex-col mb-3 md:mb-0">
//                           <div className="flex items-center gap-2 md:gap-4">
//                             <span className="text-lg font-medium text-gray-900">
//                               {order.orderNumber}
//                             </span>
//                             <StatusBadge status={order.status} />
//                           </div>
//                           <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center md:gap-3">
//                             <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
//                             <span className="hidden md:inline">•</span>
//                             <span>₹{order.totalAmount}</span>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="text-xs"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/orders/${order.orderNumber}`);
//                             }}
//                           >
//                             <Eye size={14} className="mr-1.5" />
//                             Details
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-12 px-6 text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                     <ShoppingBag size={24} className="text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     No Orders Found
//                   </h3>
//                   {searchQuery ? (
//                     <p className="text-gray-500 mb-4">
//                       No orders match your search criteria.
//                     </p>
//                   ) : (
//                     <p className="text-gray-500 mb-4">
//                       You haven't placed any orders yet.
//                     </p>
//                   )}
//                   <Button onClick={() => navigate("/")}>Start Shopping</Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/Card.jsx";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import StatusBadge from "../../common/StatusBadge";
import Breadcrumbs from "../../common/BreadCrumbs.jsx";
import Fallback from "../../common/Fallback.jsx"
import { useGetUserOrdersQuery } from '../../../features/userAuth/userOrderApiSlice.js'; 

const Order = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders using the RTK Query hook
  const { data: ordersData, isLoading, isError, error } = useGetUserOrdersQuery();

  // Extract orders from the response (adjust based on your API response structure)
  const orders = ordersData?.data || [];

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Orders", href: "/account/orders" },
  ];

  // Use Fallback for loading, error, and empty states
  if (isLoading || isError || filteredOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
        <div className="px-24 mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
            </div>
            <Breadcrumbs items={breadcrumbItems} />

            <Card className="mb-8 border-none shadow-none">
              <CardHeader className="pb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder="Search by order number or status..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Fallback
                  isLoading={isLoading}
                  error={isError ? error : null}
                  emptyMessage={
                    filteredOrders.length === 0
                      ? searchQuery
                        ? "No orders match your search criteria."
                        : "You haven't placed any orders yet."
                      : null
                  }
                  emptyActionText="Start Shopping"
                  emptyActionPath="/shop"
                  emptyIcon={<ShoppingBag />}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render orders when data is available
  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8 relative">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          <Card className="mb-8 border-none shadow-none">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search by order number or status..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order.orderNumber} className="transition-colors">
                    <div
                      className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50/50"
                    >
                      <div className="flex flex-col mb-3 md:mb-0">
                        <div className="flex items-center gap-2 md:gap-4">
                          <span className="text-lg font-medium text-gray-900">
                            {order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center md:gap-3">
                          <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                          <span className="hidden md:inline">•</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.orderNumber}`);
                          }}
                        >
                          <Eye size={14} className="mr-1.5" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;