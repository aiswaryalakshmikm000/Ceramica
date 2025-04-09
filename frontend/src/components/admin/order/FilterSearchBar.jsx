import React from "react";
import { Search, Filter, RefreshCcw, X } from "lucide-react";

const FilterSearchBar = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  itemsPerPage,
  setItemsPerPage,
  refetch,
}) => {
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setSortField("orderDate");
    setSortDirection("desc");
    setItemsPerPage(10);
    refetch();
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Out-for-Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Return-Requested">Return Requested</option>
              <option value="Return-Approved">Return Approved</option>
              <option value="Return-Rejected">Return Rejected</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
          </div>

          {/* Items Per Page Dropdown */}
          <div>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSearchBar;
