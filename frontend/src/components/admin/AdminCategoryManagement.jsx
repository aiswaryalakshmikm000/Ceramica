import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetCategoriesQuery, 
  useAddCategoryMutation,
  useUpdateCategoryMutation, 
  useListCategoryMutation 
} from '../../features/categories/AdminCategoryApiSlice';
import { setCategories, setLoading, setError } from '../../features/categories/AdminCategorySlice';
import Breadcrumbs from '../common/BreadCrumbs';
import Pagination from '../common/Pagination';
import { Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react'; // Added X for close button
import { Link } from 'react-router-dom';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState(null);
  const [editCategory, setEditCategory] = useState(null); // State for editing category
  const [editFormError, setEditFormError] = useState(null); // Error state for edit form
  
  const itemsPerPage = 10;

  const { 
    data: categoriesData, 
    isLoading, 
    isError, 
    error 
  } = useGetCategoriesQuery();
  
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation(); // Add update mutation
  const [listCategory] = useListCategoryMutation();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (isError) {
      dispatch(setError(error?.data?.message || 'Failed to fetch categories'));
    } else if (categoriesData) {
      dispatch(setCategories(categoriesData.categories));
    }
  }, [categoriesData, isLoading, isError, error, dispatch]);

  const handleToggleList = async (categoryId) => {
    try {
      console.log('Toggling category with ID:', categoryId);
      await listCategory(categoryId).unwrap();
    } catch (err) {
      console.error('Failed to toggle category status:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.description) {
      setFormError('All fields are required');
      return;
    }

    try {
      await addCategory(newCategory).unwrap();
      setNewCategory({ name: '', description: '' });
      setFormError(null);
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to add category');
    }
  };

  // Edit Category Handlers
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategory(prev => ({ ...prev, [name]: value }));
    setEditFormError(null);
  };

const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name || !editCategory.description) {
      setEditFormError('All fields are required');
      return;
    }
  
    const payload = {
      catId: editCategory._id,
      name: editCategory.name.trim(), // Ensure trimmed input
      description: editCategory.description.trim(), // Ensure trimmed input
    };
    console.log('Payload sent to updateCategory:', payload);
  
    try {
      await updateCategory(payload).unwrap();
      setEditCategory(null);
      setEditFormError(null);
    } catch (err) {
      console.error('Update category error:', err);
      setEditFormError(err?.data?.message || 'Failed to update category');
    }
  };

  const handleEditClick = (category) => {
    setEditCategory(category); // Set the category to edit
  };

  const handleCloseEdit = () => {
    setEditCategory(null); // Close the edit form
    setEditFormError(null);
  };

  // Pagination calculations
  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Categories', href: '/admin/categories' },
  ];

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories: {error?.data?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Categories Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sr No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.map((category, index) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.isListed ? (
                    <span className="text-green-600">Listed</span>
                  ) : (
                    <span className="text-red-600">Unlisted</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(category)} // Use button instead of Link
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleList(category._id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {category.isListed ? (
                        <ToggleRight size={16} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={16} className="text-red-500" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category Form (Collapsible) */}
      {editCategory && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Edit Category</h2>
            <button onClick={handleCloseEdit} className="text-gray-600 hover:text-gray-900">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div>
              <label htmlFor="editName" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="editName"
                name="name"
                value={editCategory.name}
                onChange={handleEditInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="editDescription"
                name="description"
                value={editCategory.description}
                onChange={handleEditInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter category description"
              />
            </div>
            {editFormError && (
              <div className="text-red-600 text-sm">{editFormError}</div>
            )}
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Category'}
            </button>
          </form>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter category description"
            />
          </div>
          {formError && (
            <div className="text-red-600 text-sm">{formError}</div>
          )}
          <button
            type="submit"
            disabled={isAdding}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryManagement;