// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useGetCategoriesQuery,
//   useAddCategoryMutation,
//   useUpdateCategoryMutation,
//   useListCategoryMutation,
// } from "../../features/categories/AdminCategoryApiSlice";
// import {
//   setCategories,
//   setLoading,
//   setError,
// } from "../../features/categories/AdminCategorySlice";
// import Breadcrumbs from "../common/BreadCrumbs";
// import Pagination from "../common/Pagination";
// import { Pencil, ToggleLeft, ToggleRight, X } from "lucide-react";
// import Sidebar from "./SideBar"; // Import Sidebar

// const CategoryManagement = () => {
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state) => state.categories);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [newCategory, setNewCategory] = useState({ name: "", description: "" });
//   const [formError, setFormError] = useState(null);
//   const [editCategory, setEditCategory] = useState(null);
//   const [editFormError, setEditFormError] = useState(null);

//   const itemsPerPage = 10;

//   const {
//     data: categoriesData,
//     isLoading,
//     isError,
//     error,
//   } = useGetCategoriesQuery();

//   const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
//   const [updateCategory, { isLoading: isUpdating }] =
//     useUpdateCategoryMutation();
//   const [listCategory] = useListCategoryMutation();

//   useEffect(() => {
//     if (isLoading) {
//       dispatch(setLoading());
//     } else if (isError) {
//       dispatch(setError(error?.data?.message || "Failed to fetch categories"));
//     } else if (categoriesData) {
//       dispatch(setCategories(categoriesData.categories));
//     }
//   }, [categoriesData, isLoading, isError, error, dispatch]);

//   const handleToggleList = async (categoryId) => {
//     try {
//       console.log("Toggling category with ID:", categoryId);
//       await listCategory(categoryId).unwrap();
//     } catch (err) {
//       console.error("Failed to toggle category status:", err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCategory((prev) => ({ ...prev, [name]: value }));
//     setFormError(null);
//   };

//   const handleAddCategory = async (e) => {
//     e.preventDefault();
//     if (!newCategory.name || !newCategory.description) {
//       setFormError("All fields are required");
//       return;
//     }

//     try {
//       await addCategory(newCategory).unwrap();
//       setNewCategory({ name: "", description: "" });
//       setFormError(null);
//     } catch (err) {
//       setFormError(err?.data?.message || "Failed to add category");
//     }
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditCategory((prev) => ({ ...prev, [name]: value }));
//     setEditFormError(null);
//   };

//   const handleEditCategory = async (e) => {
//     e.preventDefault();
//     if (!editCategory.name || !editCategory.description) {
//       setEditFormError("All fields are required");
//       return;
//     }

//     const payload = {
//       catId: editCategory._id,
//       name: editCategory.name.trim(),
//       description: editCategory.description.trim(),
//     };
//     console.log("Payload sent to updateCategory:", payload);

//     try {
//       await updateCategory(payload).unwrap();
//       setEditCategory(null);
//       setEditFormError(null);
//     } catch (err) {
//       console.error("Update category error:", err);
//       setEditFormError(err?.data?.message || "Failed to update category");
//     }
//   };

//   const handleEditClick = (category) => {
//     setEditCategory(category);
//   };

//   const handleCloseEdit = () => {
//     setEditCategory(null);
//     setEditFormError(null);
//   };

//   const totalItems = categories.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedCategories = categories.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   const breadcrumbItems = [
//     { label: "Admin" },
//     { label: "Categories", href: "/admin/categories" },
//   ];

//   if (isLoading) return <div>Loading categories...</div>;
//   if (isError)
//     return <div>Error loading categories: {error?.data?.message}</div>;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* Breadcrumbs */}
//         <Breadcrumbs items={breadcrumbItems} />

//         {/* Add Category Form */}
//         <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
//           <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
//             Add New Category
//           </h2>
//           <form onSubmit={handleAddCategory} className="space-y-6">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-semibold text-gray-700 mb-2"
//               >
//                 Category Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={newCategory.name}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
//                 placeholder="Enter category name"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-semibold text-gray-700 mb-2"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={newCategory.description}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 resize-none"
//                 placeholder="Enter category description"
//               />
//             </div>
//             {formError && (
//               <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
//                 {formError}
//               </div>
//             )}
//             <button
//               type="submit"
//               disabled={isAdding}
//               className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
//             >
//               {isAdding ? (
//                 <span className="flex items-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Adding...
//                 </span>
//               ) : (
//                 "Add Category"
//               )}
//             </button>
//           </form>
//         </div>
        
//         {/* Categories Table */}
//         <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
//           <table className="min-w-full divide-y divide-gray-100">
//             <thead className="bg-white-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600 uppercase tracking-wider">
//                   Sr No
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-s font-semibold text-black-600 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-gray-10 divide-y divide-gray-100">
//               {paginatedCategories.map((category, index) => (
//                 <tr
//                   key={category._id}
//                   className="hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   <td className="px-6 py-5 whitespace-nowrap text-s text-gray-600">
//                     {startIndex + index + 1}
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap text-s font-semibold text-gray-800">
//                     {category.name}
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap text-s">
//                     {category.isListed ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-s font-medium bg-green-100 text-green-800">
//                         Listed
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-s font-medium bg-red-100 text-red-500">
//                         Unlisted
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-5 whitespace-nowrap text-s font-medium">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => handleEditClick(category)}
//                         className="text-blue-600 hover:text-blue-800 transition-colors duration-200 hover:scale-110"
//                       >
//                         <Pencil size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleToggleList(category._id)}
//                         className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-110"
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

//         {/* Edit Category Form (Collapsible) */}
//         {editCategory && (
//           <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
//                 Edit Category
//               </h2>
//               <button
//                 onClick={handleCloseEdit}
//                 className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleEditCategory} className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="editName"
//                   className="block text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   id="editName"
//                   name="name"
//                   value={editCategory.name}
//                   onChange={handleEditInputChange}
//                   className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
//                   placeholder="Enter category name"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="editDescription"
//                   className="block text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   Description
//                 </label>
//                 <textarea
//                   id="editDescription"
//                   name="description"
//                   value={editCategory.description}
//                   onChange={handleEditInputChange}
//                   rows="3"
//                   className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 resize-none"
//                   placeholder="Enter category description"
//                 />
//               </div>
//               {editFormError && (
//                 <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
//                   {editFormError}
//                 </div>
//               )}
//               <button
//                 type="submit"
//                 disabled={isUpdating}
//                 className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
//               >
//                 {isUpdating ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Updating...
//                   </span>
//                 ) : (
//                   "Update Category"
//                 )}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Pagination */}
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

// export default CategoryManagement;




// src/components/admin/CategoryManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useListCategoryMutation,
} from "../../features/categories/AdminCategoryApiSlice";
import {
  setCategories,
  setLoading,
  setError,
} from "../../features/categories/AdminCategorySlice";
import Breadcrumbs from "../common/BreadCrumbs";
import Pagination from "../common/Pagination";
import { Pencil, ToggleLeft, ToggleRight, X, Image } from "lucide-react";
import Sidebar from "./SideBar";

const AdminCategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [currentPage, setCurrentPage] = useState(1);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", image: null });
  const [formError, setFormError] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editFormError, setEditFormError] = useState(null);

  const itemsPerPage = 10;

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [listCategory] = useListCategoryMutation();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (isError) {
      dispatch(setError(error?.data?.message || "Failed to fetch categories"));
    } else if (categoriesData) {
      dispatch(setCategories(categoriesData.categories));
    }
  }, [categoriesData, isLoading, isError, error, dispatch]);

  const handleToggleList = async (categoryId) => {
    try {
      await listCategory(categoryId).unwrap();
    } catch (err) {
      console.error("Failed to toggle category status:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewCategory((prev) => ({ ...prev, image: file }));
    setFormError(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({ ...prev, [name]: value }));
    setEditFormError(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditCategory((prev) => ({ ...prev, image: file }));
    setEditFormError(null);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.description) {
      setFormError("Name and description are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }

      await addCategory(formData).unwrap();
      setNewCategory({ name: "", description: "", image: null });
      setFormError(null);
    } catch (err) {
      setFormError(err?.data?.message || "Failed to add category");
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name || !editCategory.description) {
      setEditFormError("Name and description are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editCategory.name);
      formData.append("description", editCategory.description);
      if (editCategory.image instanceof File) {
        formData.append("image", editCategory.image);
      }

      await updateCategory({ catId: editCategory._id, formData }).unwrap();
      setEditCategory(null);
      setEditFormError(null);
    } catch (err) {
      setEditFormError(err?.data?.message || "Failed to update category");
    }
  };

  const handleEditClick = (category) => {
    setEditCategory({ ...category, image: null });
  };

  const handleCloseEdit = () => {
    setEditCategory(null);
    setEditFormError(null);
  };

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Categories", href: "/admin/categories" },
  ];

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories: {error?.data?.message}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Add Category Form */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-6" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Enter category description"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
            </div>
            {formError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isAdding ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* Categories Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white-50">
              <tr>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">Sr No</th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">Category</th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">Image</th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">Status</th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-10 divide-y divide-gray-100">
              {paginatedCategories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">{startIndex + index + 1}</td>
                  <td className="px-6 py-5">{category.name}</td>
                  <td className="px-6 py-5">
                    {category.images ? (
                      <img src={category.images} alt={category.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <Image size={18} className="text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {category.isListed ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">Listed</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-500">Unlisted</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex space-x-3">
                      <button onClick={() => handleEditClick(category)} className="text-blue-600">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleToggleList(category._id)} className="text-gray-600">
                        {category.isListed ? (
                          <ToggleRight size={18} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={18} className="text-red-500" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Category Form */}
        {editCategory && (
          <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Category</h2>
              <button onClick={handleCloseEdit} className="text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditCategory} className="space-y-6" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editCategory.name}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editCategory.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Image
                </label>
                {editCategory.images && (
                  <img src={editCategory.images} alt="Current" className="w-24 h-24 object-cover mb-2 rounded" />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleEditImageChange}
                  accept="image/*"
                  className="mt-1 block w-full"
                />
              </div>
              {editFormError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                  {editFormError}
                </div>
              )}
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isUpdating ? "Updating..." : "Update Category"}
              </button>
            </form>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default AdminCategoryManagement;