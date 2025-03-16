
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectProduct,
//   updateProduct,
//   setStatus,
//   setError,
// } from "../../features/products/adminProductSlice"; // Adjust path
// import { useEditProductMutation, useShowProductQuery } from "../../features/products/adminProductApiSlice";
// import { useGetCategoriesQuery } from "../../features/categories/categoryApiSlice";
// import ImageCropper from "../common/ImageCropper"; // Ensure this path matches your project structure

// const AdminEditProductPage = () => {
//   const { id } = useParams(); // Get product ID from URL
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Redux state
//   const selectedProduct = useSelector((state) => state.adminProduct.selectedProduct);
//   const reduxStatus = useSelector((state) => state.adminProduct.status);
//   const reduxError = useSelector((state) => state.adminProduct.error);

//   // RTK Query hooks
//   const { data: productData, isLoading: productLoading, error: productError } = useShowProductQuery(id);
//   const [editProduct, { isLoading: editLoading }] = useEditProductMutation();
//   const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

//   const categories = categoriesData?.categories || [];
//   const product = productData?.product;

//   // Local form state
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     discount: "",
//     categoryId: "",
//     tags: "",
//     colors: [{ name: "", stock: "", images: [] }],
//   });
//   const [deletedImages, setDeletedImages] = useState([]); // Track images to delete
//   const [localError, setLocalError] = useState(null); // Local error for form-specific issues

//   // Populate form and Redux with fetched product data
//   useEffect(() => {
//     if (product) {
//       const productDetails = {
//         name: product.name || "",
//         description: product.description || "",
//         price: product.price || "",
//         discount: product.discount || "0",
//         categoryId: product.categoryId || "",
//         tags: product.tags ? product.tags.join(", ") : "",
//         colors: product.colors.length > 0
//           ? product.colors.map((color) => ({
//               name: color.name,
//               stock: color.stock,
//               images: color.images || [],
//             }))
//           : [{ name: "", stock: "", images: [] }],
//       };
//       setFormData(productDetails);
//       dispatch(selectProduct(product)); // Store in Redux
//       dispatch(setStatus("succeeded"));
//     }
//   }, [product, dispatch]);

//   // Handle text input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle changes to color variant fields
//   const handleColorChange = (index, field, value) => {
//     const updatedColors = [...formData.colors];
//     updatedColors[index][field] = value;
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   // Add a new color variant
//   const addColorVariant = () => {
//     setFormData((prev) => ({
//       ...prev,
//       colors: [...prev.colors, { name: "", stock: "", images: [] }],
//     }));
//   };

//   // Remove a color variant
//   const removeColorVariant = (index) => {
//     const updatedColors = formData.colors.filter((_, i) => i !== index);
//     const removedColor = formData.colors[index];
//     if (removedColor.images.length > 0) {
//       const urlsToDelete = removedColor.images.filter((img) => typeof img === "string");
//       setDeletedImages((prev) => [...prev, ...urlsToDelete]);
//     }
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   // Handle new cropped image addition
//   const handleImageCrop = (index, croppedImage) => {
//     const updatedColors = [...formData.colors];
//     updatedColors[index].images = [...updatedColors[index].images, croppedImage];
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   // Handle image deletion
//   const handleImageDelete = (colorIndex, imageIndex) => {
//     const updatedColors = [...formData.colors];
//     const deletedImage = updatedColors[colorIndex].images[imageIndex];
//     if (typeof deletedImage === "string") {
//       setDeletedImages((prev) => [...prev, deletedImage]);
//     }
//     updatedColors[colorIndex].images = updatedColors[colorIndex].images.filter(
//       (_, i) => i !== imageIndex
//     );
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("FormData before submission:", formData);
//     console.log("Deleted Images:", deletedImages);

//     dispatch(setStatus("loading"));

//     const productData = new FormData();
//     productData.append("name", formData.name);
//     productData.append("description", formData.description);
//     productData.append("price", formData.price);
//     productData.append("discount", formData.discount || "0");
//     productData.append("categoryId", formData.categoryId);
//     const tagsArray = formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [];
//     productData.append("tags", JSON.stringify(tagsArray));

//     const colorsData = formData.colors.map((color) => ({
//       name: color.name,
//       stock: color.stock,
//     }));
//     productData.append("colors", JSON.stringify(colorsData));

//     let totalImages = 0;
//     let hasMissingImages = false;
//     const updatedUrls = [];
//     formData.colors.forEach((color, index) => {
//       if (color.images.length === 0) {
//         setLocalError(`Please upload at least one image for color: ${color.name}`);
//         hasMissingImages = true;
//         dispatch(setStatus("failed"));
//         return;
//       }
//       color.images.forEach((image) => {
//         if (image instanceof File) {
//           productData.append(`color${index}Images`, image);
//         } else if (typeof image === "string") {
//           updatedUrls.push(image);
//         }
//         totalImages++;
//       });
//     });

//     if (hasMissingImages) return;
//     if (totalImages < 3) {
//       setLocalError("Please ensure at least 3 images are present across all color variants.");
//       dispatch(setStatus("failed"));
//       return;
//     }

//     if (deletedImages.length > 0) {
//       productData.append("deletedImages", JSON.stringify(deletedImages));
//     }
//     if (updatedUrls.length > 0) {
//       productData.append("updatedUrls", JSON.stringify(updatedUrls));
//     }

//     for (let [key, value] of productData.entries()) {
//       console.log(`${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
//     }

//     try {
//       const response = await editProduct({ _id: id, productData }).unwrap();
//       console.log("Product updated successfully:", response);
//       dispatch(updateProduct(response.product)); // Update Redux store
//       dispatch(setStatus("succeeded"));
//       navigate(`/admin/products/${id}`);
//     } catch (err) {
//       console.error("RTK Query error:", err);
//       dispatch(setError(err?.data?.message || "Failed to update product"));
//       dispatch(setStatus("failed"));
//       setLocalError(err?.data?.message || "An error occurred while updating the product");
//     }
//   };

//   // Loading and error states
//   if (productLoading || categoriesLoading) {
//     dispatch(setStatus("loading"));
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <p className="text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   if (productError) {
//     dispatch(setError(productError.message));
//     dispatch(setStatus("failed"));
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <p className="text-red-500">Error loading product: {productError.message}</p>
//       </div>
//     );
//   }

//   if (categoriesError) {
//     dispatch(setError(categoriesError.message));
//     dispatch(setStatus("failed"));
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <p className="text-red-500">Error loading categories: {categoriesError.message}</p>
//       </div>
//     );
//   }

//   if (!product) {
//     dispatch(setStatus("failed"));
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <p className="text-gray-700">Product not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Product</h1>
//       {(localError || reduxError) && (
//         <p className="text-red-500 text-center mb-4">
//           {localError || reduxError}
//         </p>
//       )}
//       {reduxStatus === "loading" && (
//         <p className="text-gray-700 text-center mb-4">Processing...</p>
//       )}
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Product Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//               Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               min="0"
//               step="0.01"
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             rows="4"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
//               Discount (%)
//             </label>
//             <input
//               type="number"
//               id="discount"
//               name="discount"
//               value={formData.discount}
//               onChange={handleChange}
//               min="0"
//               max="90"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               id="categoryId"
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category._id} value={category._id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
//             Tags (comma-separated)
//           </label>
//           <input
//             type="text"
//             id="tags"
//             name="tags"
//             value={formData.tags}
//             onChange={handleChange}
//             placeholder="e.g., ceramic, handmade"
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Color Variants</h3>
//           {formData.colors.map((color, index) => (
//             <div
//               key={index}
//               className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Color Name</label>
//                   <input
//                     type="text"
//                     value={color.name}
//                     onChange={(e) => handleColorChange(index, "name", e.target.value)}
//                     required
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Stock</label>
//                   <input
//                     type="number"
//                     value={color.stock}
//                     onChange={(e) => handleColorChange(index, "stock", e.target.value)}
//                     min="0"
//                     required
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Images (at least 1 per variant)
//                   </label>
//                   <ImageCropper onCropComplete={(croppedImage) => handleImageCrop(index, croppedImage)} />
//                   {color.images.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {color.images.map((image, imgIndex) => (
//                         <div key={imgIndex} className="relative">
//                           <img
//                             src={image instanceof File ? URL.createObjectURL(image) : image}
//                             alt={`Color ${color.name} - ${imgIndex + 1}`}
//                             className="w-16 h-16 object-cover rounded-md"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleImageDelete(index, imgIndex)}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {formData.colors.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeColorVariant(index)}
//                   className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                 >
//                   Remove Color
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addColorVariant}
//             className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             Add Another Color
//           </button>
//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             disabled={editLoading || reduxStatus === "loading"}
//             className={`px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
//               (editLoading || reduxStatus === "loading") ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {editLoading || reduxStatus === "loading" ? "Updating Product..." : "Update Product"}
//           </button>
//         </div>
//       </form>
//     </div>
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
import { useGetCategoriesQuery } from "../../features/categories/categoryApiSlice";
import ProductForm from "../../components/admin/ProductForm";

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
      navigate(`/admin/products/${id}`);
    } catch (err) {
      console.error("RTK Query error:", err);
      dispatch(setError(err?.data?.message || "Failed to update product"));
      dispatch(setStatus("failed"));
    }
  };

  if (productLoading || categoriesLoading) {
    dispatch(setStatus("loading"));
    return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (productError) {
    dispatch(setError(productError.message));
    dispatch(setStatus("failed"));
    return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p className="text-red-500">Error loading product: {productError.message}</p></div>;
  }

  if (categoriesError) {
    dispatch(setError(categoriesError.message));
    dispatch(setStatus("failed"));
    return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p className="text-red-500">Error loading categories: {categoriesError.message}</p></div>;
  }

  if (!product) {
    dispatch(setStatus("failed"));
    return <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center"><p>Product not found.</p></div>;
  }

  const initialData = {
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    discount: product.discount || "0",
    categoryId: product.categoryId || "", // Ensure this is a string matching a category _id
    tags: product.tags ? product.tags.join(", ") : "",
    colors: product.colors.length > 0
      ? product.colors.map((color) => ({
          name: color.name,
          stock: color.stock,
          images: color.images || [],
        }))
      : [{ name: "", stock: "", images: [] }],
  };

  // Debugging: Log the initial categoryId and available categories
  console.log("Product categoryId:", product.categoryId);
  console.log("Available categories:", categories);

  return (
    <ProductForm
      initialData={initialData}
      categories={categories}
      onSubmit={handleSubmit}
      isLoading={editLoading || reduxStatus === "loading"}
      error={reduxError}
      isEditMode={true}
    />
  );
};

export default AdminEditProductPage;