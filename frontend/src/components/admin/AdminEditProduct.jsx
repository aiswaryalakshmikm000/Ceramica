
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProduct,
  updateProduct,
  setStatus,
  setError,
} from "../../features/products/adminProductSlice";
import { useEditProductMutation, useShowProductQuery } from "../../features/products/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../features/categories/AdminCategoryApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "../../components/admin/ProductForm";
import Sidebar from "../../components/admin/SideBar"; 

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxStatus = useSelector((state) => state.adminProduct.status);

  const { data: productData, isLoading: productLoading, error: productError } = useShowProductQuery(id);
  const [editProduct, { isLoading: editLoading }] = useEditProductMutation();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

  const categories = categoriesData?.categories || [];
  const product = productData?.product;

  useEffect(() => {
    if (product) {
      dispatch(selectProduct(product));
      dispatch(setStatus("succeeded"));
    }
  }, [product, dispatch]);

  const handleSubmit = async (productData) => {
    dispatch(setStatus("loading"));
    try {
      const response = await editProduct({ _id: id, productData }).unwrap();
      dispatch(updateProduct(response.product));
      dispatch(setStatus("succeeded"));
      toast.success(response.message); // "Product edited successfully"
      navigate("/admin/products");
    } catch (err) {
      console.error("RTK Query error:", err);
      const errorMessage = err?.data?.message || "Something went wrong while editing the product.";
      dispatch(setError(errorMessage));
      dispatch(setStatus("failed"));
      toast.error(errorMessage); // Uses exact backend error messages
    }
  };

  if (productLoading || categoriesLoading) {
    dispatch(setStatus("loading"));
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (productError) {
    const errorMessage = productError?.data?.message || "Error loading product";
    dispatch(setError(errorMessage));
    dispatch(setStatus("failed"));
    toast.error(errorMessage);
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">{errorMessage}</p>
        </main>
      </div>
    );
  }

  if (categoriesError) {
    const errorMessage = categoriesError?.data?.message || "Error loading categories";
    dispatch(setError(errorMessage));
    dispatch(setStatus("failed"));
    toast.error(errorMessage);
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">{errorMessage}</p>
        </main>
      </div>
    );
  }

  if (!product) {
    dispatch(setStatus("failed"));
    toast.error("Product not found");
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p>Product not found.</p>
        </main>
      </div>
    );
  }

  const initialData = {
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    discount: product.discount || "0",
    categoryId: product.categoryId || "", 
    tags: product.tags ? product.tags.join(", ") : "",
    isFeatured: product.isFeatured || false,
    colors: product.colors.length > 0
      ? product.colors.map((color) => ({
          name: color.name,
          stock: color.stock,
          images: color.images || [],
        }))
      : [{ name: "", stock: "", images: [] }],
  };

  console.log("Product categoryId:", product.categoryId);
  console.log("Available categories:", categories);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <ProductForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={editLoading || reduxStatus === "loading"}
          isEditMode={true}
        />
      </main>
    </div>
  );
};

export default AdminEditProductPage;