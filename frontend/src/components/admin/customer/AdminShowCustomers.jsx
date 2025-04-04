import React, { useState } from "react";
import {
  useGetCustomerDetailsQuery,
  useEditCustomerStatusMutation,
} from "../../../features/adminAuth/AdminCustomerApiSlice";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
import { Eye } from "lucide-react";
import Sidebar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminShowCustomers = () => {
  const navigate = useNavigate();

  // Local state replacing Redux slice
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query hook for fetching customer data
  const {
    data: customerData,
    isLoading,
    error,
  } = useGetCustomerDetailsQuery({ page: currentPage, limit, term: searchTerm });

  const [editCustomerStatus] = useEditCustomerStatusMutation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  const { users, totalPages } = customerData || {};
  const totalItems = users?.length ? totalPages * limit : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: "Admin" }, { label: "Customers" }]} />

        {/* Search and Limit Controls */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={limit}
            onChange={handleLimitChange}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Sr No</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Email ID</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="p-3 text-sm">{user.name}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        user.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{user.phone || "N/A"}</td>
                  <td className="p-3 text-sm flex gap-2">
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
                      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default AdminShowCustomers;