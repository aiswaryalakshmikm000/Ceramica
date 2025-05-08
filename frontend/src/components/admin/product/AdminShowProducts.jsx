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
  const [limit, setLimit] = useState(10); 
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