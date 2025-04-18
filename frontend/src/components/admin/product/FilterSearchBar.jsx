// import React from "react";
// import { Search, Filter, RefreshCcw, X, Plus } from "lucide-react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ChevronDown, ChevronRight, Check } from "lucide-react";

// const FilterSearchBar = ({
//   filter,
//   setFilter,
//   setPage,
//   limit,
//   setLimit,
//   resetFilters,
//   isFilterOpen,
//   setIsFilterOpen,
//   openSubMenu,
//   setOpenSubMenu,
//   categories,
//   handleFilterChange,
//   dropdownRef,
// }) => {
//   const toggleSubMenu = (menu) => {
//     setOpenSubMenu(openSubMenu === menu ? null : menu);
//   };

//   const handleLimitChange = (e) => {
//     setLimit(parseInt(e.target.value));
//     setPage(1); // Reset to first page when limit changes
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//       <div className="flex flex-col md:flex-row gap-4 justify-between">
//         {/* Left Section: Search and Filters */}
//         <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//           {/* Search Bar */}
//           <div className="relative flex-grow md:flex-grow-0 md:w-[770px]">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={filter.search}
//               onChange={(e) => handleFilterChange("search", e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
//             />
//             {filter.search && (
//               <button
//                 onClick={() => handleFilterChange("search", "")}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 <X size={18} className="text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>

//           {/* Filter Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//             >
//               <Filter size={18} className="absolute left-3 text-gray-400" />
//               Filter
//               <ChevronDown
//                 size={18}
//                 className={`${isFilterOpen ? "rotate-180" : ""} transition-transform`}
//               />
//             </button>

//             {isFilterOpen && (
//               <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
//                 <div className="py-2">
//                   {/* Reset Filters */}
//                   <button
//                     onClick={resetFilters}
//                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center gap-2"
//                   >
//                     <RefreshCcw size={18} />
//                     Reset Filters
//                   </button>
//                   <hr className="my-1 border-gray-200" />

//                   {/* Category Filter */}
//                   <div>
//                     <button
//                       onClick={() => toggleSubMenu("category")}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                     >
//                       Category
//                       <ChevronRight
//                         size={16}
//                         className={`${openSubMenu === "category" ? "rotate-90" : ""} transition-transform`}
//                       />
//                     </button>
//                     {openSubMenu === "category" && (
//                       <div className="pl-4 bg-gray-50 max-h-48 overflow-y-auto">
//                         {categories.length > 0 ? (
//                           categories.map((category) => (
//                             <label
//                               key={category._id}
//                               className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-gray-700"
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={filter.category.includes(category._id)}
//                                 onChange={() => handleFilterChange("category", category._id)}
//                                 className="h-4 w-4 text-[#3c73a8] focus:ring-[#3c73a8]"
//                               />
//                               {category.name}
//                             </label>
//                           ))
//                         ) : (
//                           <span className="block w-full text-left px-4 py-2 text-gray-400">
//                             No categories
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Status Filter */}
//                   <div>
//                     <button
//                       onClick={() => toggleSubMenu("status")}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                     >
//                       Status
//                       <ChevronRight
//                         size={16}
//                         className={`${openSubMenu === "status" ? "rotate-90" : ""} transition-transform`}
//                       />
//                     </button>
//                     {openSubMenu === "status" && (
//                       <div className="pl-4 bg-gray-50">
//                         <button
//                           onClick={() => handleFilterChange("status", "")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "" ? "font-semibold" : ""}`}
//                         >
//                           {filter.status === "" && <Check size={14} />}
//                           All Status
//                         </button>
//                         <button
//                           onClick={() => handleFilterChange("status", "listed")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "listed" ? "font-semibold" : ""}`}
//                         >
//                           {filter.status === "listed" && <Check size={14} />}
//                           Listed
//                         </button>
//                         <button
//                           onClick={() => handleFilterChange("status", "unlisted")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "unlisted" ? "font-semibold" : ""}`}
//                         >
//                           {filter.status === "unlisted" && <Check size={14} />}
//                           Unlisted
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Stock Filter */}
//                   <div>
//                     <button
//                       onClick={() => toggleSubMenu("stock")}
//                       className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                     >
//                       Stock
//                       <ChevronRight
//                         size={16}
//                         className={`${openSubMenu === "stock" ? "rotate-90" : ""} transition-transform`}
//                       />
//                     </button>
//                     {openSubMenu === "stock" && (
//                       <div className="pl-4 bg-gray-50">
//                         <button
//                           onClick={() => handleFilterChange("stock", "")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "" ? "font-semibold" : ""}`}
//                         >
//                           {filter.stock === "" && <Check size={14} />}
//                           All Stock
//                         </button>
//                         <button
//                           onClick={() => handleFilterChange("stock", "instock")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "instock" ? "font-semibold" : ""}`}
//                         >
//                           {filter.stock === "instock" && <Check size={14} />}
//                           In Stock
//                         </button>
//                         <button
//                           onClick={() => handleFilterChange("stock", "outofstock")}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "outofstock" ? "font-semibold" : ""}`}
//                         >
//                           {filter.stock === "outofstock" && <Check size={14} />}
//                           Out of Stock
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Limit Dropdown */}
//           <div>
//             <select
//               value={limit}
//               onChange={handleLimitChange}
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>
//           </div>
//         </div>

//         {/* Right Section: Add Product Button */}
//         <Link
//           to="/admin/products/add"
//           className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8] flex items-center gap-2"
//         >
//           <Plus size={18} />
//           Add Product
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default FilterSearchBar;



import React from "react";
import { Search, Filter, RefreshCcw, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

const FilterSearchBar = ({
  filter,
  setFilter,
  setPage,
  limit,
  setLimit,
  resetFilters,
  isFilterOpen,
  setIsFilterOpen,
  openSubMenu,
  setOpenSubMenu,
  categories,
  handleFilterChange,
  dropdownRef,
}) => {
  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        {/* Left Section: Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
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

          <div className="flex flex-row gap-4 sm:items-center">
            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] whitespace-nowrap"
              >
                <Filter size={18} className="absolute left-3 text-gray-400" />
                Filter
                <ChevronDown
                  size={18}
                  className={`${isFilterOpen ? "rotate-180" : ""} transition-transform`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {/* Reset Filters */}
                    <button
                      onClick={resetFilters}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center gap-2"
                    >
                      <RefreshCcw size={18} />
                      Reset Filters
                    </button>
                    <hr className="my-1 border-gray-200" />

                    {/* Category Filter */}
                    <div>
                      <button
                        onClick={() => toggleSubMenu("category")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
                      >
                        Category
                        <ChevronRight
                          size={16}
                          className={`${openSubMenu === "category" ? "rotate-90" : ""} transition-transform`}
                        />
                      </button>
                      {openSubMenu === "category" && (
                        <div className="pl-4 bg-gray-50 max-h-48 overflow-y-auto">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <label
                                key={category._id}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-gray-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={filter.category.includes(category._id)}
                                  onChange={() => handleFilterChange("category", category._id)}
                                  className="h-4 w-4 text-[#3c73a8] focus:ring-[#3c73a8]"
                                />
                                {category.name}
                              </label>
                            ))
                          ) : (
                            <span className="block w-full text-left px-4 py-2 text-gray-400">
                              No categories
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Filter */}
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
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "" ? "font-semibold" : ""}`}
                          >
                            {filter.status === "" && <Check size={14} />}
                            All Status
                          </button>
                          <button
                            onClick={() => handleFilterChange("status", "listed")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "listed" ? "font-semibold" : ""}`}
                          >
                            {filter.status === "listed" && <Check size={14} />}
                            Listed
                          </button>
                          <button
                            onClick={() => handleFilterChange("status", "unlisted")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === "unlisted" ? "font-semibold" : ""}`}
                          >
                            {filter.status === "unlisted" && <Check size={14} />}
                            Unlisted
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <button
                        onClick={() => toggleSubMenu("stock")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
                      >
                        Stock
                        <ChevronRight
                          size={16}
                          className={`${openSubMenu === "stock" ? "rotate-90" : ""} transition-transform`}
                        />
                      </button>
                      {openSubMenu === "stock" && (
                        <div className="pl-4 bg-gray-50">
                          <button
                            onClick={() => handleFilterChange("stock", "")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "" ? "font-semibold" : ""}`}
                          >
                            {filter.stock === "" && <Check size={14} />}
                            All Stock
                          </button>
                          <button
                            onClick={() => handleFilterChange("stock", "instock")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "instock" ? "font-semibold" : ""}`}
                          >
                            {filter.stock === "instock" && <Check size={14} />}
                            In Stock
                          </button>
                          <button
                            onClick={() => handleFilterChange("stock", "outofstock")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === "outofstock" ? "font-semibold" : ""}`}
                          >
                            {filter.stock === "outofstock" && <Check size={14} />}
                            Out of Stock
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Limit Dropdown */}
            <div>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Section: Add Product Button */}
        <div className="flex items-center sm:justify-end">
          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8] flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FilterSearchBar;