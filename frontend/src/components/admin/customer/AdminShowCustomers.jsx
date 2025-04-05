// import React, { useState } from "react";
// import {
//   useGetCustomerDetailsQuery,
//   useEditCustomerStatusMutation,
// } from "../../../features/adminAuth/AdminCustomerApiSlice";
// import Breadcrumbs from "../../common/BreadCrumbs";
// import Pagination from "../../common/Pagination";
// import { Eye } from "lucide-react";
// import Sidebar from "../SideBar";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AdminShowCustomers = () => {
//   const navigate = useNavigate();

//   // Local state replacing Redux slice
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");

//   // RTK Query hook for fetching customer data
//   const {
//     data: customerData,
//     isLoading,
//     error,
//   } = useGetCustomerDetailsQuery({ page: currentPage, limit, term: searchTerm });

//   const [editCustomerStatus] = useEditCustomerStatusMutation();

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleLimitChange = (e) => {
//     setLimit(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page when limit changes
//   };

//   const handleToggleStatus = async (userId) => {
//     try {
//       const response = await editCustomerStatus(userId).unwrap();
//       toast.success(response.message || "Customer status updated successfully");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update customer status");
//     }
//   };

//   const handleViewDetails = (userId) => {
//     navigate(`/admin/customers/${userId}`);
//   };

//   if (error) {
//     toast.error(error?.data?.message || "Failed to load customer data");
//     return (
//       <div className="text-center py-10 text-red-500">
//         Error: {error?.data?.message || error.message}
//       </div>
//     );
//   }

//   if (isLoading) return <div className="text-center py-10">Loading...</div>;

//   const { users, totalPages } = customerData || {};
//   const totalItems = users?.length ? totalPages * limit : 0;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* Breadcrumbs */}
//         <Breadcrumbs items={[{ label: "Admin" }, { label: "Customers" }]} />

//         {/* Search and Limit Controls */}
//         <div className="flex justify-between items-center mb-6">
//           <input
//             type="text"
//             placeholder="Search customers..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <select
//             value={limit}
//             onChange={handleLimitChange}
//             className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value={5}>5 per page</option>
//             <option value={10}>10 per page</option>
//             <option value={20}>20 per page</option>
//           </select>
//         </div>

//         {/* Customer Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border rounded">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Sr No</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Email ID</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users?.map((user, index) => (
//                 <tr key={user._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3 text-sm">
//                     {(currentPage - 1) * limit + index + 1}
//                   </td>
//                   <td className="p-3 text-sm">{user.name}</td>
//                   <td className="p-3 text-sm">{user.email}</td>
//                   <td className="p-3 text-sm">
//                     <span
//                       className={`px-2 py-1 rounded text-white ${
//                         user.isBlocked ? "bg-red-500" : "bg-green-500"
//                       }`}
//                     >
//                       {user.isBlocked ? "Blocked" : "Active"}
//                     </span>
//                   </td>
//                   <td className="p-3 text-sm">{user.phone || "N/A"}</td>
//                   <td className="p-3 text-sm flex gap-2">
//                     <button
//                       onClick={() => handleToggleStatus(user._id)}
//                       className={`px-3 py-1 rounded text-white ${
//                         user.isBlocked
//                           ? "bg-green-500 hover:bg-green-600"
//                           : "bg-red-500 hover:bg-red-600"
//                       }`}
//                     >
//                       {user.isBlocked ? "Unblock" : "Block"}
//                     </button>
//                     <button
//                       onClick={() => handleViewDetails(user._id)}
//                       className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
//                     >
//                       <Eye size={16} />
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               )) || (
//                 <tr>
//                   <td colSpan="6" className="p-3 text-center">
//                     No customers found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 0 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={totalItems}
//             itemsPerPage={limit}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminShowCustomers;



import React, { useState } from "react";
import {
  useGetCustomerDetailsQuery,
  useEditCustomerStatusMutation,
} from "../../../features/adminAuth/AdminCustomerApiSlice";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
import { Eye, Search } from "lucide-react";
import Sidebar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminShowCustomers = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: customerData,
    isLoading,
    error,
  } = useGetCustomerDetailsQuery({ page: currentPage, limit, term: searchTerm });

  const [editCustomerStatus] = useEditCustomerStatusMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await editCustomerStatus(userId).unwrap();
      toast.success(response.message || "Customer status updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update customer status");
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/admin/customers/${userId}`);
  };

  if (error) {
    toast.error(error?.data?.message || "Failed to load customer data");
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error?.data?.message || error.message}
      </div>
    );
  }

  const getStatusBadgeClass = (isBlocked) => {
    return isBlocked 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  };

  const { users, totalPages } = customerData || {};
  const totalItems = users?.length ? totalPages * limit : 0;

  // Breadcrumbs data
  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Customer Management</h1>
          <p className="text-gray-600">View and manage customer accounts</p>
        </div>

        {/* Search and Limit Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
              />
            </div>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="pl-4 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c73a8] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : !users || users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.isBlocked)}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`px-3 py-1 rounded text-white ${
                            user.isBlocked
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleViewDetails(user._id)}
                          className="text-[#3c73a8] hover:text-[#2c5580] flex items-center gap-1"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminShowCustomers;