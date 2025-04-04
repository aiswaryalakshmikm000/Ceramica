
import React, { useState, useRef, useEffect } from 'react';
import { useShowProductsQuery, useUpdateProductStatusMutation } from '../../../features/adminAuth/adminProductApiSlice';
import { useGetCategoriesQuery } from '../../../features/adminAuth/AdminCategoryApiSlice';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../common/BreadCrumbs';
import Pagination from '../../common/Pagination';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import Sidebar from '../SideBar';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const AdminShowProducts = () => {
  const [filter, setFilter] = useState({
    search: '',
    category: [],
    status: '',
    stock: ''
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const dropdownRef = useRef(null);

  const queryParams = {
    search: filter.search || undefined,
    categoryIds: filter.category.length > 0 ? filter.category.join(',') : undefined,
    isListed: filter.status === 'listed' ? true : filter.status === 'unlisted' ? false : undefined,
    stockFilter: filter.stock === 'instock' ? 'inStock' : filter.stock === 'outofstock' ? 'outOfStock' : undefined,
    page,
    limit
  };

  const { data: productsData, isLoading: productsLoading, error: productsError } = useShowProductsQuery(queryParams);
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const handleFilterChange = (name, value) => {
    if (name === 'category') {
      setFilter(prev => {
        const currentCategories = prev.category;
        if (currentCategories.includes(value)) {
          return { ...prev, category: currentCategories.filter(id => id !== value) };
        } else {
          return { ...prev, category: [...currentCategories, value] };
        }
      });
    } else {
      setFilter(prev => ({ ...prev, [name]: value }));
      setOpenSubMenu(null);
    }
    setPage(1); // Reset to page 1 on filter change
  };

  const resetFilters = () => {
    setFilter({
      search: '',
      category: [],
      status: '',
      stock: ''
    });
    setPage(1);
    setOpenSubMenu(null);
    toast.info("Filters reset successfully");
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await updateProductStatus(productId).unwrap();
      toast.success(response.message || `Product ${currentStatus ? 'unlisted' : 'listed'} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update product status');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
        setOpenSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (productsLoading || categoriesLoading) return <div className="text-center py-10">Loading...</div>;

  if (productsError) {
    toast.error(productsError?.data?.message || "Failed to load products");
    return <div className="text-center py-10 text-red-500">Error: {productsError?.data?.message || productsError.message}</div>;
  }

  if (categoriesError) {
    toast.error(categoriesError?.data?.message || "Failed to load categories");
    return <div className="text-center py-10 text-red-500">Error: {categoriesError?.data?.message || categoriesError.message}</div>;
  }

  const breadcrumbItems = [
    { label: 'Admin' },
    { label: 'Products', href: '/admin/products' }
  ];

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search products..."
              className="p-2 border rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Single Filter Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 border rounded bg-white flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Filter <ChevronDown size={16} className={`${isFilterOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {/* Reset Filters */}
                    <button
                      onClick={resetFilters}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium flex items-center gap-2"
                    >
                      <span>Reset Filters</span>
                    </button>

                    {/* Divider */}
                    <hr className="my-1 border-gray-200" />

                    {/* Category Filter */}
                    <div>
                      <button
                        onClick={() => toggleSubMenu('category')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                      >
                        Category
                        <ChevronRight size={16} className={`${openSubMenu === 'category' ? 'rotate-90' : ''} transition-transform`} />
                      </button>
                      {openSubMenu === 'category' && (
                        <div className="pl-4 bg-gray-50 max-h-48 overflow-y-auto">
                          {categories.length > 0 ? (
                            categories.map(category => (
                              <label
                                key={category._id}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={filter.category.includes(category._id)}
                                  onChange={() => handleFilterChange('category', category._id)}
                                  className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                                />
                                {category.name}
                              </label>
                            ))
                          ) : (
                            <span className="block w-full text-left px-4 py-2 text-gray-400">No categories</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Filter */}
                    <div>
                      <button
                        onClick={() => toggleSubMenu('status')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                      >
                        Status
                        <ChevronRight size={16} className={`${openSubMenu === 'status' ? 'rotate-90' : ''} transition-transform`} />
                      </button>
                      {openSubMenu === 'status' && (
                        <div className="pl-4 bg-gray-50">
                          <button
                            onClick={() => handleFilterChange('status', '')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.status === '' ? 'font-semibold' : ''}`}
                          >
                            {filter.status === '' && <Check size={14} />}
                            All Status
                          </button>
                          <button
                            onClick={() => handleFilterChange('status', 'listed')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.status === 'listed' ? 'font-semibold' : ''}`}
                          >
                            {filter.status === 'listed' && <Check size={14} />}
                            Listed
                          </button>
                          <button
                            onClick={() => handleFilterChange('status', 'unlisted')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.status === 'unlisted' ? 'font-semibold' : ''}`}
                          >
                            {filter.status === 'unlisted' && <Check size={14} />}
                            Unlisted
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <button
                        onClick={() => toggleSubMenu('stock')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                      >
                        Stock
                        <ChevronRight size={16} className={`${openSubMenu === 'stock' ? 'rotate-90' : ''} transition-transform`} />
                      </button>
                      {openSubMenu === 'stock' && (
                        <div className="pl-4 bg-gray-50">
                          <button
                            onClick={() => handleFilterChange('stock', '')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.stock === '' ? 'font-semibold' : ''}`}
                          >
                            {filter.stock === '' && <Check size={14} />}
                            All Stock
                          </button>
                          <button
                            onClick={() => handleFilterChange('stock', 'instock')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.stock === 'instock' ? 'font-semibold' : ''}`}
                          >
                            {filter.stock === 'instock' && <Check size={14} />}
                            In Stock
                          </button>
                          <button
                            onClick={() => handleFilterChange('stock', 'outofstock')}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${filter.stock === 'outofstock' ? 'font-semibold' : ''}`}
                          >
                            {filter.stock === 'outofstock' && <Check size={14} />}
                            Out of Stock
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/admin/products/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Discount</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsData?.products?.length > 0 ? (
                productsData.products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {product.colors?.length > 0 && product.colors[0]?.images?.length > 0 ? (
                        <img
                          src={product.colors[0].images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price.toFixed(0)}</td>
                    <td className="p-2">{product.categoryId?.name || 'N/A'}</td>
                    <td className="p-2">{product.totalStock}</td>
                    <td className="p-2">
                      {product.isListed ? 'Listed' : 'Unlisted'}
                    </td>
                    <td className="p-2">{product.discount}%</td>
                    <td className="p-2 flex gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleProductStatus(product._id, product.isListed)}
                        className={`text-${
                          product.isListed ? 'red' : 'green'
                        }-500 hover:underline`}
                      >
                        {product.isListed ? 'Unlist' : 'List'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-2 text-center">No products found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={productsData?.totalPages || 1}
            totalItems={productsData?.totalProductsCount || 0}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminShowProducts;