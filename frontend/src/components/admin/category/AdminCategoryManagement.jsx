import React, { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useListCategoryMutation,
} from "../../../features/adminAuth/AdminCategoryApiSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
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
    { label: "Admin" },
    { label: "Categories", href: "/admin/categories" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p>Loading categories...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">
            {error?.data?.message || "Error loading categories"}
          </p>
        </main>
      </div>
    );
  }
  
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