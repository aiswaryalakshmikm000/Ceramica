// import React, { useState } from "react";
// import { useAddProductMutation } from "../../features/products/adminProductApiSlice";
// import { useGetCategoriesQuery } from "../../features/categories/categoryApiSlice";
// import { useNavigate } from "react-router-dom";
// import ImageCropper from "../common/ImageCropper"; // Ensure this path matches your project structure

// const AdminAddProductPage = () => {
//   const [addProduct, { isLoading, error }] = useAddProductMutation();
//   const { data, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
//   const navigate = useNavigate();

//   const categories = data?.categories || [];

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     discount: "",
//     categoryId: "",
//     tags: "",
//     colors: [{ name: "", stock: "", images: [] }],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleColorChange = (index, field, value) => {
//     const updatedColors = [...formData.colors];
//     updatedColors[index][field] = value;
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   const addColorVariant = () => {
//     setFormData((prev) => ({
//       ...prev,
//       colors: [...prev.colors, { name: "", stock: "", images: [] }],
//     }));
//   };

//   const handleImageCrop = (index, croppedImage) => {
//     const updatedColors = [...formData.colors];
//     updatedColors[index].images = [...updatedColors[index].images, croppedImage];
//     setFormData((prev) => ({ ...prev, colors: updatedColors }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("FormData before submission:", formData);

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

//     if (colorsData.length === 0) {
//       alert("Please add at least one color variant.");
//       return;
//     }

//     productData.append("colors", JSON.stringify(colorsData));

//     let totalImages = 0;
//     let hasMissingImages = false;
//     formData.colors.forEach((color, index) => {
//       if (color.images.length === 0) {
//         alert(`Please upload and crop at least one image for color: ${color.name}`);
//         hasMissingImages = true;
//         return;
//       }
//       color.images.forEach((image) => {
//         productData.append(`color${index}Images`, image);
//         totalImages++;
//       });
//     });

//     if (hasMissingImages) return;

//     if (totalImages < 3) {
//       alert("Please upload and crop at least 3 images across all color variants.");
//       return;
//     }

//     for (let [key, value] of productData.entries()) {
//       console.log(`${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
//     }

//     try {
//       const response = await addProduct(productData).unwrap();
//       console.log("Product added successfully:", response);
//       // Assuming the response contains the product ID as either '_id' or 'id'
//       const productId = response._id || response.id;
//       if (productId) {
//         navigate(`/admin/products/${productId}`);
//       } else {
//         // Fallback navigation if no ID is returned
//         navigate("/admin/products/");
//       }
//     } catch (err) {
//       console.error("RTK Query error:", err);
//     }
//   };

//   if (categoriesLoading) return <p>Loading categories...</p>;
//   if (categoriesError) return <p>Error loading categories: {categoriesError.message}</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Product</h1>
//       {error && (
//         <p className="text-red-500 text-center mb-4">
//           {error?.data?.message || "An error occurred"}
//         </p>
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
//                     Images (crop and upload at least 1 per variant)
//                   </label>
//                   <ImageCropper onCropComplete={(croppedImage) => handleImageCrop(index, croppedImage)} />
//                   {color.images.length > 0 && (
//                     <p className="mt-2 text-sm text-gray-600">
//                       {color.images.length} image(s) uploaded
//                     </p>
//                   )}
//                 </div>
//               </div>
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
//             disabled={isLoading}
//             className={`px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isLoading ? "Adding Product..." : "Add Product"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdminAddProductPage;


// src/pages/admin/AdminAddProductPage.jsx
import React from "react";
import { useAddProductMutation } from "../../features/products/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../features/categories/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm"; // Adjust path as needed

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

  if (categoriesLoading) return <p>Loading categories...</p>;
  if (categoriesError) return <p>Error loading categories: {categoriesError.message}</p>;

  return (
    <ProductForm
      categories={categories}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default AdminAddProductPage;