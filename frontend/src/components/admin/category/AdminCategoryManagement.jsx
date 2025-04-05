// import React, { useEffect, useState } from "react";
// import {
//   useGetCategoriesQuery,
//   useUpdateCategoryMutation,
//   useListCategoryMutation,
// } from "../../../features/adminAuth/AdminCategoryApiSlice";
// import { toast } from "react-toastify";
// import Breadcrumbs from "../../common/BreadCrumbs";
// import Pagination from "../../common/Pagination";
// import { Pencil, ToggleLeft, ToggleRight, Image } from "lucide-react";
// import Sidebar from "../SideBar";
// import AddCategory from "./AdminAddCategory";
// import EditCategory from "./AdminEditCategory";

// const AdminCategoryManagement = () => {

//   const [currentPage, setCurrentPage] = useState(1);
//   const [editCategory, setEditCategory] = useState(null);

//   const itemsPerPage = 10;

//   const {
//     data: categoriesData,
//     isLoading,
//     isError,
//     error,
//   } = useGetCategoriesQuery();

//   const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
//   const [listCategory] = useListCategoryMutation();

//   const categories = categoriesData?.categories || [];

//   const handleToggleList = async (categoryId) => {
//     try {
//       await listCategory(categoryId).unwrap();
//       toast.success("Category status changed.");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to toggle category status");
//       console.error("Failed to toggle category status:", err);
//     }
//   };

//   const handleEditClick = (category) => {
//     setEditCategory({ ...category, image: null });
//   };

//   const totalItems = categories.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

//   const breadcrumbItems = [
//     { label: "Admin" },
//     { label: "Categories", href: "/admin/categories" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
//           <p>Loading categories...</p>
//         </main>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
//           <p className="text-red-500">
//             {error?.data?.message || "Error loading categories"}
//           </p>
//         </main>
//       </div>
//     );
//   }
  
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <Breadcrumbs items={breadcrumbItems} />

//         <AddCategory />
//         {/* Categories Table */}
//         <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
//           <table className="min-w-full divide-y divide-gray-100">
//             <thead className="bg-white-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
//                   Sr No
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
//                   Category
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
//                   Image
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-gray-10 divide-y divide-gray-100">
//               {paginatedCategories.map((category, index) => (
//                 <tr key={category._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-5">{startIndex + index + 1}</td>
//                   <td className="px-6 py-5">{category.name}</td>
//                   <td className="px-6 py-5">
//                     {category.images ? (
//                       <img
//                         src={category.images}
//                         alt={category.name}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                     ) : (
//                       <Image size={18} className="text-gray-400" />
//                     )}
//                   </td>
//                   <td className="px-6 py-5">
//                     {category.isListed ? (
//                       <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
//                         Listed
//                       </span>
//                     ) : (
//                       <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-500">
//                         Unlisted
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => handleEditClick(category)}
//                         className="text-blue-600"
//                       >
//                         <Pencil size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleToggleList(category._id)}
//                         className="text-gray-600"
//                       >
//                         {category.isListed ? (
//                           <ToggleRight size={18} className="text-green-500" />
//                         ) : (
//                           <ToggleLeft size={18} className="text-red-500" />
//                         )}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Edit Category Component */}
//         {editCategory && (
//           <EditCategory
//             editCategory={editCategory}
//             setEditCategory={setEditCategory}
//             updateCategory={updateCategory}
//             isUpdating={isUpdating}
//           />
//         )}

//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           totalItems={totalItems}
//           itemsPerPage={itemsPerPage}
//           onPageChange={setCurrentPage}
//         />
//       </main>
//     </div>
//   );
// };

// export default AdminCategoryManagement;



import React, { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useListCategoryMutation,
} from "../../../features/adminAuth/AdminCategoryApiSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination"; // Assuming this is the path to your Pagination component
import { Pencil, ToggleLeft, ToggleRight, Image } from "lucide-react";
import Sidebar from "../SideBar";
import AddCategory from "./AdminAddCategory";
import EditCategory from "./AdminEditCategory";

const AdminCategoryManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editCategory, setEditCategory] = useState(null);
  const itemsPerPage = 10;

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [listCategory] = useListCategoryMutation();

  const categories = categoriesData?.categories || [];

  const handleToggleList = async (categoryId) => {
    try {
      await listCategory(categoryId).unwrap();
      toast.success("Category status changed.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to toggle category status");
      console.error("Failed to toggle category status:", err);
    }
  };

  const handleEditClick = (category) => {
    setEditCategory({ ...category, image: null });
  };

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Categories", href: "/admin/categories" },
  ];

  const getStatusBadgeClass = (isListed) => {
    return isListed 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <p className="text-gray-500">Loading categories...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">
            {error?.data?.message || "Error loading categories"}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Category Management</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <AddCategory />
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c73a8] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.images ? (
                        <img
                          src={category.images}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <Image size={18} className="text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(category.isListed)}`}>
                        {category.isListed ? "Listed" : "Unlisted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-[#3c73a8] hover:text-[#2c5580]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleList(category._id)}
                        className={`px-3 py-1 rounded text-white ${
                          category.isListed
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {category.isListed ? "Unlist" : "List"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Category Component */}
        {editCategory && (
          <EditCategory
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            updateCategory={updateCategory}
            isUpdating={isUpdating}
          />
        )}
      </main>
    </div>
  );
};

export default AdminCategoryManagement;