import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCustomerDetailsQuery,
  useEditCustomerStatusMutation,
} from "../../features/customers/AdminCustomerApiSlice";
import {
  setCurrentPage,
  setLimit,
  setSearchTerm,
} from "../../features/customers/AdminCustomerSlice"; // Adjust path as needed
import Breadcrumbs from "../common/BreadCrumbs"; // Adjust path as needed
import Pagination from "../common/Pagination"; // Adjust path as needed
import { Eye } from "lucide-react"; // For "View Details" icon

const AdminShowCustomers = () => {
  const dispatch = useDispatch();
  const { currentPage, limit, searchTerm } = useSelector((state) => state.customers);

  const {
    data: customerData,
    isLoading,
    error,
  } = useGetCustomerDetailsQuery({ page: currentPage, limit, term: searchTerm });

  const [editCustomerStatus] = useEditCustomerStatusMutation();

  // Handle search input
  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Handle page change from Pagination component
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    dispatch(setLimit(Number(e.target.value)));
    dispatch(setCurrentPage(1)); // Reset to page 1 when limit changes
  };

  // Handle status toggle
  const handleToggleStatus = async (userId) => {
    try {
      await editCustomerStatus(userId).unwrap();
      console.log("Customer status updated");
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle view details (placeholder for now)
  const handleViewDetails = (userId) => {
    console.log("View details for customer:", userId);
    navigate(`/admin/customers/${userId}`);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error: {error.message}</div>
    );

  const { users, totalPages } = customerData;
  const totalItems = users.length ? totalPages * limit : 0; // Approximate total items

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Customers" },
        ]}
      />

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
            {users.map((user, index) => (
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
                      user.isBlocked ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminShowCustomers;