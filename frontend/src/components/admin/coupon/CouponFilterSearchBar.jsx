// src/components/admin/coupons/CouponFilterSearchBar.js
import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, RefreshCcw, X, Plus } from "lucide-react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

const CouponFilterSearchBar = ({
  filter,
  setFilter,
  setPage,
  limit,
  setLimit,
  resetFilters,
  handleFilterChange,
  openModal,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const dropdownRef = useRef(null);

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
        setOpenSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search, Filter, and Limit in a single flex container */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-80 md:w-[34rem]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search coupons..."
              value={filter.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
            />
            {filter.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] w-full sm:w-auto"
            >
              <Filter size={18} className="absolute left-3 text-gray-400" />
              Filter
              <ChevronDown
                size={18}
                className={`${isFilterOpen ? "rotate-180" : ""} transition-transform`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute left-0 sm:right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={resetFilters}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center gap-2"
                  >
                    <RefreshCcw size={18} />
                    Reset Filters
                  </button>
                  <hr className="my-1 border-gray-200" />

                  <div>
                    <button
                      onClick={() => toggleSubMenu("status")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
                    >
                      Status
                      <ChevronRight
                        size={16}
                        className={`${openSubMenu === "status" ? "rotate-90" : ""} transition-transform`}
                      />
                    </button>
                    {openSubMenu === "status" && (
                      <div className="pl-4 bg-gray-50">
                        <button
                          onClick={() => handleFilterChange("status", "")}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${
                            filter.status === "" ? "font-semibold" : ""
                          }`}
                        >
                          {filter.status === "" && <Check size={14} />}
                          All Status
                        </button>
                        <button
                          onClick={() => handleFilterChange("status", "active")}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${
                            filter.status === "active" ? "font-semibold" : ""
                          }`}
                        >
                          {filter.status === "active" && <Check size={14} />}
                          Active
                        </button>
                        <button
                          onClick={() => handleFilterChange("status", "inactive")}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${
                            filter.status === "inactive" ? "font-semibold" : ""
                          }`}
                        >
                          {filter.status === "inactive" && <Check size={14} />}
                          Inactive
                        </button>
                        <button
                          onClick={() => handleFilterChange("status", "expired")}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${
                            filter.status === "expired" ? "font-semibold" : ""
                          }`}
                        >
                          {filter.status === "expired" && <Check size={14} />}
                          Expired
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Limit Selector */}
          <div>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent w-full sm:w-auto"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Add Coupon Button */}
        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8] flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>
    </div>
  );
};

export default CouponFilterSearchBar;