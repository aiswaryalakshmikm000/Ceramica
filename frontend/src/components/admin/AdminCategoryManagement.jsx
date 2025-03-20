
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useGetCategoriesQuery,
//   useUpdateCategoryMutation,
//   useListCategoryMutation,
// } from "../../features/categories/AdminCategoryApiSlice";
// import {
//   setCategories,
//   setLoading,
//   setError,
// } from "../../features/categories/AdminCategorySlice";
// import { toast } from "react-toastify";
// import Breadcrumbs from "../common/BreadCrumbs";
// import Pagination from "../common/Pagination";
// import { Pencil, ToggleLeft, ToggleRight, X, Image } from "lucide-react";
// import Sidebar from "./SideBar";
// import AddCategory from "./AdminAddCategory";

// const AdminCategoryManagement = () => {
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state) => state.categories);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [editCategory, setEditCategory] = useState(null);

//   const itemsPerPage = 10;

//   const {
//     data: categoriesData,
//     isLoading,
//     isError,
//     error,
//   } = useGetCategoriesQuery();

//   const [updateCategory, { isLoading: isUpdating }] =
//     useUpdateCategoryMutation();
//   const [listCategory] = useListCategoryMutation();

//   useEffect(() => {
//     if (isLoading) {
//       dispatch(setLoading());
//     } else if (isError) {
//       dispatch(setError(error?.data?.message || "Failed to fetch categories"));
//       toast.error(error?.data?.message || "Failed to fetch categories");
//     } else if (categoriesData) {
//       dispatch(setCategories(categoriesData.categories));
//     }
//   }, [categoriesData, isLoading, isError, error, dispatch]);

//   const handleToggleList = async (categoryId) => {
//     try {
//       await listCategory(categoryId).unwrap();
//       toast.success("Category status changed.");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to toggle category status");
//       console.error("Failed to toggle category status:", err);
//     }
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditCategory((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditImageChange = (e) => {
//     const file = e.target.files[0];
//     setEditCategory((prev) => ({ ...prev, image: file }));
//   };

//   const handleEditCategory = async (e) => {
//     e.preventDefault();
//     if (!editCategory.name || !editCategory.description) {
//       toast.error("Name and description are required");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", editCategory.name);
//       formData.append("description", editCategory.description);
//       if (editCategory.image instanceof File) {
//         formData.append("image", editCategory.image);
//       }

//       const result = await updateCategory({
//         catId: editCategory._id,
//         formData,
//       }).unwrap();
//       setEditCategory(null);
//       toast.success(result.message || "Category updated successfully");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update category");
//     }
//   };

//   const handleEditClick = (category) => {
//     setEditCategory({ ...category, image: null });
//   };

//   const handleCloseEdit = () => {
//     setEditCategory(null);
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
//   if (isError) return <div>Error loading categories</div>;

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

//         {/* Edit Category Form */}
//         {editCategory && (
//           <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Edit Category</h2>
//               <button onClick={handleCloseEdit} className="text-gray-600">
//                 <X size={20} />
//               </button>
//             </div>
//             <form
//               onSubmit={handleEditCategory}
//               className="space-y-6"
//               encType="multipart/form-data"
//             >
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editCategory.name}
//                   onChange={handleEditInputChange}
//                   className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={editCategory.description}
//                   onChange={handleEditInputChange}
//                   rows="3"
//                   className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Category Image
//                 </label>
//                 {editCategory.images && (
//                   <img
//                     src={editCategory.images}
//                     alt="Current"
//                     className="w-24 h-24 object-cover mb-2 rounded"
//                   />
//                 )}
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={handleEditImageChange}
//                   accept="image/*"
//                   className="mt-1 block w-full"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={isUpdating}
//                 className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
//               >
//                 {isUpdating ? "Updating..." : "Update Category"}
//               </button>
//             </form>
//           </div>
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
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useListCategoryMutation,
} from "../../features/categories/AdminCategoryApiSlice";
import {
  setCategories,
  setLoading,
  setError,
} from "../../features/categories/AdminCategorySlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../common/BreadCrumbs";
import Pagination from "../common/Pagination";
import { Pencil, ToggleLeft, ToggleRight, Image } from "lucide-react";
import Sidebar from "./SideBar";
import AddCategory from "./AdminAddCategory";
import EditCategory from "./AdminEditCategory"; // Import the new component

const AdminCategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

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

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (isError) {
      dispatch(setError(error?.data?.message || "Failed to fetch categories"));
      toast.error(error?.data?.message || "Failed to fetch categories");
    } else if (categoriesData) {
      dispatch(setCategories(categoriesData.categories));
    }
  }, [categoriesData, isLoading, isError, error, dispatch]);

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
    { label: "Admin" },
    { label: "Categories", href: "/admin/categories" },
  ];

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Breadcrumbs items={breadcrumbItems} />

        <AddCategory />
        {/* Categories Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white-50">
              <tr>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
                  Sr No
                </th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-s font-semibold text-black-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-10 divide-y divide-gray-100">
              {paginatedCategories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-5">{startIndex + index + 1}</td>
                  <td className="px-6 py-5">{category.name}</td>
                  <td className="px-6 py-5">
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
                  <td className="px-6 py-5">
                    {category.isListed ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                        Listed
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-500">
                        Unlisted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleList(category._id)}
                        className="text-gray-600"
                      >
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

        {/* Edit Category Component */}
        {editCategory && (
          <EditCategory
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            updateCategory={updateCategory}
            isUpdating={isUpdating}
          />
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