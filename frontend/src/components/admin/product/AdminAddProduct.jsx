import React from "react";
import { useAddProductMutation } from "../../../features/products/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../../features/categories/AdminCategoryApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./ProductForm"; 
import Sidebar from "../SideBar"; 
import Breadcrumbs from "../../common/BreadCrumbs"; 

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
      console.error("RTK Query error:", err);
      const errorMessage = err?.data?.message || "Something went wrong while adding the product.";
      toast.error(errorMessage); 
    }
  };

  if (categoriesLoading)
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">Loading categories...</main>
      </div>
    );
    
  if (categoriesError) {
    const errorMessage = `Error loading categories: ${categoriesError.message}`;
    toast.error(errorMessage);
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">{errorMessage}</main>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Add Product", href: "/admin/products/add" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default AdminAddProductPage;