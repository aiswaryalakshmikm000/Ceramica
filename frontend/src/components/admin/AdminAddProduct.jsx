import React from "react";
import { useAddProductMutation } from "../../features/products/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../features/categories/AdminCategoryApiSlice";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm"; // Adjust path as needed
import Sidebar from "./SideBar"; // Adjust path as needed
import Breadcrumbs from "../common/BreadCrumbs"; // Assuming you have this component

const AdminAddProductPage = () => {
  const [addProduct, { isLoading, error }] = useAddProductMutation();
  const { data, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const navigate = useNavigate();

  const categories = data?.categories || [];

  const handleSubmit = async (productData) => {
    try {
      const response = await addProduct(productData).unwrap();
      console.log("Product added successfully:", response);
      const productId = response._id || response.id;
      navigate(productId ? `/admin/products/${productId}` : "/admin/products");
    } catch (err) {
      console.error("RTK Query error:", err);
    }
  };

  if (categoriesLoading) return <div className="flex h-screen bg-gray-100"><Sidebar /><main className="flex-1 p-8">Loading categories...</main></div>;
  if (categoriesError) return <div className="flex h-screen bg-gray-100"><Sidebar /><main className="flex-1 p-8">Error loading categories: {categoriesError.message}</main></div>;

  // Breadcrumbs for navigation
  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Add Product", href: "/admin/products/add" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Product Form */}
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default AdminAddProductPage;