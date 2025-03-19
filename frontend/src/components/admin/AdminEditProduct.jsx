
// // src/pages/admin/AdminEditProductPage.jsx
// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectProduct,
//   updateProduct,
//   setStatus,
//   setError,
// } from "../../features/products/adminProductSlice";
// import { useEditProductMutation, useShowProductQuery } from "../../features/products/adminProductApiSlice";
// import { useGetCategoriesQuery } from "../../features/categories/AdminCategoryApiSlice";
// import ProductForm from "../../components/admin/ProductForm";

// const AdminEditProductPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const reduxStatus = useSelector((state) => state.adminProduct.status);
//   const reduxError = useSelector((state) => state.adminProduct.error);

//   const { data: productData, isLoading: productLoading, error: productError } = useShowProductQuery(id);
//   const [editProduct, { isLoading: editLoading }] = useEditProductMutation();
//   const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

//   const categories = categoriesData?.categories || [];
//   const product = productData?.product;

//   useEffect(() => {
//     if (product) {
//       dispatch(selectProduct(product));
//       dispatch(setStatus("succeeded"));
//     }
//   }, [product, dispatch]);

//   const handleSubmit = async (productData) => {
//     dispatch(setStatus("loading"));
//     try {
//       const response = await editProduct({ _id: id, productData }).unwrap();
//       console.log("Product updated successfully:", response);
//       dispatch(updateProduct(response.product));
//       dispatch(setStatus("succeeded"));
//       navigate(`/admin/products/${id}`);
//     } catch (err) {
//       console.error("RTK Query error:", err);
//       dispatch(setError(err?.data?.message || "Failed to update product"));
//       dispatch(setStatus("failed"));
//     }
//   };

//   if (productLoading || categoriesLoading) {
//     dispatch(setStatus("loading"));
//     return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
//   }

//   if (productError) {
//     dispatch(setError(productError.message));
//     dispatch(setStatus("failed"));
//     return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p className="text-red-500">Error loading product: {productError.message}</p></div>;
//   }

//   if (categoriesError) {
//     dispatch(setError(categoriesError.message));
//     dispatch(setStatus("failed"));
//     return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p className="text-red-500">Error loading categories: {categoriesError.message}</p></div>;
//   }

//   if (!product) {
//     dispatch(setStatus("failed"));
//     return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p>Product not found.</p></div>;
//   }

//   const initialData = {
//     name: product.name || "",
//     description: product.description || "",
//     price: product.price || "",
//     discount: product.discount || "0",
//     categoryId: product.categoryId || "", // Ensure this is a string matching a category _id
//     tags: product.tags ? product.tags.join(", ") : "",
//     colors: product.colors.length > 0
//       ? product.colors.map((color) => ({
//           name: color.name,
//           stock: color.stock,
//           images: color.images || [],
//         }))
//       : [{ name: "", stock: "", images: [] }],
//   };

//   // Debugging: Log the initial categoryId and available categories
//   console.log("Product categoryId:", product.categoryId);
//   console.log("Available categories:", categories);

//   return (
//     <ProductForm
//       initialData={initialData}
//       categories={categories}
//       onSubmit={handleSubmit}
//       isLoading={editLoading || reduxStatus === "loading"}
//       error={reduxError}
//       isEditMode={true}
//     />
//   );
// };

// export default AdminEditProductPage;



// src/pages/admin/AdminEditProductPage.jsx
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
import ProductForm from "../../components/admin/ProductForm";
import Sidebar from "../../components/admin/SideBar"; 

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxStatus = useSelector((state) => state.adminProduct.status);
  const reduxError = useSelector((state) => state.adminProduct.error);

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
      console.log("Product updated successfully:", response);
      dispatch(updateProduct(response.product));
      dispatch(setStatus("succeeded"));
      navigate("/admin/products");
    } catch (err) {
      console.error("RTK Query error:", err);
      dispatch(setError(err?.data?.message || "Failed to update product"));
      dispatch(setStatus("failed"));
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
    dispatch(setError(productError.message));
    dispatch(setStatus("failed"));
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">Error loading product: {productError.message}</p>
        </main>
      </div>
    );
  }

  if (categoriesError) {
    dispatch(setError(categoriesError.message));
    dispatch(setStatus("failed"));
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <p className="text-red-500">Error loading categories: {categoriesError.message}</p>
        </main>
      </div>
    );
  }

  if (!product) {
    dispatch(setStatus("failed"));
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <ProductForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={editLoading || reduxStatus === "loading"}
          error={reduxError}
          isEditMode={true}
        />
      </main>
    </div>
  );
};

export default AdminEditProductPage;