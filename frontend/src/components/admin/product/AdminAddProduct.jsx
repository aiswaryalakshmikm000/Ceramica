import React from "react";
import { useAddProductMutation } from "../../../features/adminAuth/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../../features/adminAuth/AdminCategoryApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./ProductForm";
import Sidebar from "../SideBar";

const AdminAddProductPage = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const navigate = useNavigate();

  const categories = data?.categories || [];

  const handleSubmit = async (productData) => {
    try {
      const response = await addProduct(productData).unwrap();
      const productId = response.product?._id || response.id;
      navigate("/admin/products");
    } catch (err) {
      const errorMessage = err?.data?.message || "Something went wrong while adding the product.";
      toast.error(errorMessage);
    }
  };

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Add Product", href: "/admin/products/add" },
  ];

  if (categoriesLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-10 text-gray-500">Loading categories...</div>
        </main>
      </div>
    );
  }

  if (categoriesError) {
    const errorMessage = `Error loading categories: ${categoriesError.message}`;
    toast.error(errorMessage);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-10 text-red-500">{errorMessage}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

export default AdminAddProductPage;