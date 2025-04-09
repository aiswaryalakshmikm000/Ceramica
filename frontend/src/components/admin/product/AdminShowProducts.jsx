
// import React, { useState, useRef, useEffect } from 'react';
// import { useShowProductsQuery, useUpdateProductStatusMutation } from '../../../features/adminAuth/adminProductApiSlice';
// import { useGetCategoriesQuery } from '../../../features/adminAuth/AdminCategoryApiSlice';
// import { Link } from 'react-router-dom';
// import Breadcrumbs from '../../common/BreadCrumbs';
// import Pagination from '../../common/Pagination';
// import { ChevronDown, ChevronRight, Check } from 'lucide-react';
// import Sidebar from '../SideBar';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AdminShowProducts = () => {
//   const [filter, setFilter] = useState({
//     search: '',
//     category: [],
//     status: '',
//     stock: ''
//   });
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [openSubMenu, setOpenSubMenu] = useState(null);
//   const dropdownRef = useRef(null);

//   const queryParams = {
//     search: filter.search || undefined,
//     categoryIds: filter.category.length > 0 ? filter.category.join(',') : undefined,
//     isListed: filter.status === 'listed' ? true : filter.status === 'unlisted' ? false : undefined,
//     stockFilter: filter.stock === 'instock' ? 'inStock' : filter.stock === 'outofstock' ? 'outOfStock' : undefined,
//     page,
//     limit
//   };

//   const { data: productsData, isLoading: productsLoading, error: productsError } = useShowProductsQuery(queryParams);
//   const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
//   const [updateProductStatus] = useUpdateProductStatusMutation();

//   const handleFilterChange = (name, value) => {
//     if (name === 'category') {
//       setFilter(prev => {
//         const currentCategories = prev.category;
//         if (currentCategories.includes(value)) {
//           return { ...prev, category: currentCategories.filter(id => id !== value) };
//         } else {
//           return { ...prev, category: [...currentCategories, value] };
//         }
//       });
//     } else {
//       setFilter(prev => ({ ...prev, [name]: value }));
//       setOpenSubMenu(null);
//     }
//     setPage(1); 
//   };

//   const resetFilters = () => {
//     setFilter({
//       search: '',
//       category: [],
//       status: '',
//       stock: ''
//     });
//     setPage(1);
//     setOpenSubMenu(null);
//     toast.info("Filters reset successfully");
//   };

//   const toggleProductStatus = async (productId, currentStatus) => {
//     try {
//       const response = await updateProductStatus(productId).unwrap();
//       toast.success(response.message || `Product ${currentStatus ? 'unlisted' : 'listed'} successfully`);
//     } catch (err) {
//       toast.error(err?.data?.message || 'Failed to update product status');
//     }
//   };
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsFilterOpen(false);
//         setOpenSubMenu(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (productsLoading || categoriesLoading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

//   if (productsError) {
//     toast.error(productsError?.data?.message || "Failed to load products");
//     return <div className="text-center py-10 text-red-500">Error: {productsError?.data?.message || productsError.message}</div>;
//   }

//   if (categoriesError) {
//     toast.error(categoriesError?.data?.message || "Failed to load categories");
//     return <div className="text-center py-10 text-red-500">Error: {categoriesError?.data?.message || categoriesError.message}</div>;
//   }

//   const breadcrumbItems = [
//     { label: 'Admin' },
//     { label: 'Products', href: '/admin/products' }
//   ];

//   const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

//   const toggleSubMenu = (menu) => {
//     setOpenSubMenu(openSubMenu === menu ? null : menu);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-y-auto">
//         {/* Header */}
//         <div className="mb-6">
//         <Breadcrumbs items={breadcrumbItems} />
//           <h1 className="text-2xl font-bold text-[#3c73a8] mb-2">Product Management</h1>
//           <p className="text-gray-600">Manage products, update status, and add new items</p>
          
//         </div>

//         {/* Filters and Actions */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <div className="flex flex-col md:flex-row gap-4 justify-between">
//             <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//               <div className="relative flex-grow md:flex-grow-0 md:w-[890px]">
//                 <input
//                   type="text"
//                   name="search"
//                   value={filter.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                   placeholder="Search products..."
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setIsFilterOpen(!isFilterOpen)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//                 >
//                   <svg className="h-5 w-5 text-gray-400 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   Filter
//                   <ChevronDown size={18} className={`${isFilterOpen ? 'rotate-180' : ''} transition-transform`} />
//                 </button>

//                 {isFilterOpen && (
//                   <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
//                     <div className="py-2">
//                       <button
//                         onClick={resetFilters}
//                         className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium flex items-center gap-2"
//                       >
//                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         Reset Filters
//                       </button>
//                       <hr className="my-1 border-gray-200" />

//                       {/* Category Filter */}
//                       <div>
//                         <button
//                           onClick={() => toggleSubMenu('category')}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                         >
//                           Category
//                           <ChevronRight size={16} className={`${openSubMenu === 'category' ? 'rotate-90' : ''} transition-transform`} />
//                         </button>
//                         {openSubMenu === 'category' && (
//                           <div className="pl-4 bg-gray-50 max-h-48 overflow-y-auto">
//                             {categories.length > 0 ? (
//                               categories.map(category => (
//                                 <label
//                                   key={category._id}
//                                   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-gray-700"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={filter.category.includes(category._id)}
//                                     onChange={() => handleFilterChange('category', category._id)}
//                                     className="h-4 w-4 text-[#3c73a8] focus:ring-[#3c73a8]"
//                                   />
//                                   {category.name}
//                                 </label>
//                               ))
//                             ) : (
//                               <span className="block w-full text-left px-4 py-2 text-gray-400">No categories</span>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* Status Filter */}
//                       <div>
//                         <button
//                           onClick={() => toggleSubMenu('status')}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                         >
//                           Status
//                           <ChevronRight size={16} className={`${openSubMenu === 'status' ? 'rotate-90' : ''} transition-transform`} />
//                         </button>
//                         {openSubMenu === 'status' && (
//                           <div className="pl-4 bg-gray-50">
//                             <button
//                               onClick={() => handleFilterChange('status', '')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === '' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.status === '' && <Check size={14} />}
//                               All Status
//                             </button>
//                             <button
//                               onClick={() => handleFilterChange('status', 'listed')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === 'listed' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.status === 'listed' && <Check size={14} />}
//                               Listed
//                             </button>
//                             <button
//                               onClick={() => handleFilterChange('status', 'unlisted')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.status === 'unlisted' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.status === 'unlisted' && <Check size={14} />}
//                               Unlisted
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {/* Stock Filter */}
//                       <div>
//                         <button
//                           onClick={() => toggleSubMenu('stock')}
//                           className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center text-gray-700"
//                         >
//                           Stock
//                           <ChevronRight size={16} className={`${openSubMenu === 'stock' ? 'rotate-90' : ''} transition-transform`} />
//                         </button>
//                         {openSubMenu === 'stock' && (
//                           <div className="pl-4 bg-gray-50">
//                             <button
//                               onClick={() => handleFilterChange('stock', '')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === '' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.stock === '' && <Check size={14} />}
//                               All Stock
//                             </button>
//                             <button
//                               onClick={() => handleFilterChange('stock', 'instock')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === 'instock' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.stock === 'instock' && <Check size={14} />}
//                               In Stock
//                             </button>
//                             <button
//                               onClick={() => handleFilterChange('stock', 'outofstock')}
//                               className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 ${filter.stock === 'outofstock' ? 'font-semibold' : ''}`}
//                             >
//                               {filter.stock === 'outofstock' && <Check size={14} />}
//                               Out of Stock
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Link
//               to="/admin/products/add"
//               className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//             >
//               Add Product
//             </Link>
//           </div>
//         </div>

//         {/* Products Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-[#3c73a8] text-white">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Image
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Discount
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {productsData?.products?.length > 0 ? (
//                   productsData.products.map(product => (
//                     <tr key={product._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {product.colors?.length > 0 && product.colors[0]?.images?.length > 0 ? (
//                           <img
//                             src={product.colors[0].images[0]}
//                             alt={product.name}
//                             className="w-12 h-12 object-cover rounded"
//                             onError={(e) => (e.target.src = '/fallback-image.jpg')}
//                           />
//                         ) : (
//                           <span className="text-gray-500">No Image</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {product.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         ₹{product.price.toFixed(0)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {product.categoryId?.name || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {product.totalStock}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {product.isListed ? 'Listed' : 'Unlisted'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {product.discount}%
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex gap-2">
//                           <Link
//                             to={`/admin/products/edit/${product._id}`}
//                             className="text-[#3c73a8] hover:text-[#2c5580]"
//                           >
//                             Edit
//                           </Link>
//                           <button
//                             onClick={() => toggleProductStatus(product._id, product.isListed)}
//                             className={`text-${product.isListed ? 'red' : 'green'}-500 hover:underline`}
//                           >
//                             {product.isListed ? 'Unlist' : 'List'}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
//                       No products found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(page * limit, productsData?.totalProductsCount || 0)}
//                   </span>{' '}
//                   of <span className="font-medium">{productsData?.totalProductsCount || 0}</span> results
//                 </p>
//               </div>
//               <div>
//                 <Pagination
//                   currentPage={page}
//                   totalPages={productsData?.totalPages || 1}
//                   totalItems={productsData?.totalProductsCount || 0}
//                   itemsPerPage={limit}
//                   onPageChange={setPage}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminShowProducts;




import React, { useState, useRef, useEffect } from "react";
import { useShowProductsQuery, useUpdateProductStatusMutation } from "../../../features/adminAuth/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../../features/adminAuth/AdminCategoryApiSlice";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import Sidebar from "../SideBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSearchBar from "./FilterSearchBar"; 
import { Link } from 'react-router-dom';

const AdminShowProducts = () => {
  const [filter, setFilter] = useState({
    search: "",
    category: [],
    status: "",
    stock: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Now a state variable
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const dropdownRef = useRef(null);

  const queryParams = {
    search: filter.search || undefined,
    categoryIds: filter.category.length > 0 ? filter.category.join(",") : undefined,
    isListed: filter.status === "listed" ? true : filter.status === "unlisted" ? false : undefined,
    stockFilter: filter.stock === "instock" ? "inStock" : filter.stock === "outofstock" ? "outOfStock" : undefined,
    page,
    limit,
  };

  const { data: productsData, isLoading: productsLoading, error: productsError } = useShowProductsQuery(queryParams);
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const handleFilterChange = (name, value) => {
    if (name === "category") {
      setFilter((prev) => {
        const currentCategories = prev.category;
        if (currentCategories.includes(value)) {
          return { ...prev, category: currentCategories.filter((id) => id !== value) };
        } else {
          return { ...prev, category: [...currentCategories, value] };
        }
      });
    } else {
      setFilter((prev) => ({ ...prev, [name]: value }));
      setOpenSubMenu(null);
    }
    setPage(1);
  };

  const resetFilters = () => {
    setFilter({
      search: "",
      category: [],
      status: "",
      stock: "",
    });
    setPage(1);
    setOpenSubMenu(null);
    setIsFilterOpen(false);
    toast.info("Filters reset successfully");
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await updateProductStatus(productId).unwrap();
      toast.success(response.message || `Product ${currentStatus ? "unlisted" : "listed"} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product status");
    }
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

  if (productsLoading || categoriesLoading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  if (productsError) {
    toast.error(productsError?.data?.message || "Failed to load products");
    return <div className="text-center py-10 text-red-500">Error: {productsError?.data?.message || productsError.message}</div>;
  }

  if (categoriesError) {
    toast.error(categoriesError?.data?.message || "Failed to load categories");
    return <div className="text-center py-10 text-red-500">Error: {categoriesError?.data?.message || categoriesError.message}</div>;
  }

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Products", href: "/admin/products" },
  ];

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2">Product Management</h1>
          <p className="text-gray-600">Manage products, update status, and add new items</p>
        </div>

        {/* Filter Search Bar */}
        <FilterSearchBar
          filter={filter}
          setFilter={setFilter}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          resetFilters={resetFilters}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          openSubMenu={openSubMenu}
          setOpenSubMenu={setOpenSubMenu}
          categories={categories}
          handleFilterChange={handleFilterChange}
          dropdownRef={dropdownRef}
        />

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c73a8] text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsData?.products?.length > 0 ? (
                  productsData.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.colors?.length > 0 && product.colors[0]?.images?.length > 0 ? (
                          <img
                            src={product.colors[0].images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => (e.target.src = "/fallback-image.jpg")}
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price.toFixed(0)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoryId?.name || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.isListed ? "Listed" : "Unlisted"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.discount}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link to={`/admin/products/edit/${product._id}`} className="text-[#3c73a8] hover:text-[#2c5580]">
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleProductStatus(product._id, product.isListed)}
                            className={`text-${product.isListed ? "red" : "green"}-500 hover:underline`}
                          >
                            {product.isListed ? "Unlist" : "List"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, productsData?.totalProductsCount || 0)}</span> of{" "}
                  <span className="font-medium">{productsData?.totalProductsCount || 0}</span> results
                </p>
              </div>
              <div>
                <Pagination
                  currentPage={page}
                  totalPages={productsData?.totalPages || 1}
                  totalItems={productsData?.totalProductsCount || 0}
                  itemsPerPage={limit}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminShowProducts;