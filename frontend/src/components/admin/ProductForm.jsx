// // src/components/admin/ProductForm.jsx
// import React, { useState } from "react";
// import ImageCropper from "../common/ImageCropper"; // Adjust path as needed

// const ProductForm = ({
//   initialData = {
//     name: "",
//     description: "",
//     price: "",
//     discount: "",
//     categoryId: "",
//     tags: "",
//     colors: [{ name: "", stock: "", images: [] }],
//   },
//   categories = [],
//   onSubmit,
//   isLoading = false,
//   error = null,
//   isEditMode = false,
// }) => {
//   const [formData, setFormData] = useState(initialData);
//   const [deletedImages, setDeletedImages] = useState([]); // Only used in edit mode
//   const [localError, setLocalError] = useState(null);

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

//   // Remove a color variant (edit mode only)
//   const removeColorVariant = (index) => {
//     if (!isEditMode) return; // Only allow removal in edit mode
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

//   // Handle image deletion (edit mode only)
//   const handleImageDelete = (colorIndex, imageIndex) => {
//     if (!isEditMode) return; // Only allow deletion in edit mode
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
//     setLocalError(null);

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
//     const updatedUrls = isEditMode ? [] : null; // Only used in edit mode

//     formData.colors.forEach((color, index) => {
//       if (color.images.length === 0) {
//         setLocalError(`Please upload at least one image for color: ${color.name}`);
//         hasMissingImages = true;
//         return;
//       }
//       color.images.forEach((image) => {
//         if (image instanceof File) {
//           productData.append(`color${index}Images`, image);
//         } else if (isEditMode && typeof image === "string") {
//           updatedUrls.push(image);
//         }
//         totalImages++;
//       });
//     });

//     if (hasMissingImages) return;
//     if (totalImages < 3) {
//       setLocalError("Please ensure at least 3 images are present across all color variants.");
//       return;
//     }

//     if (isEditMode && deletedImages.length > 0) {
//       productData.append("deletedImages", JSON.stringify(deletedImages));
//     }
//     if (isEditMode && updatedUrls.length > 0) {
//       productData.append("updatedUrls", JSON.stringify(updatedUrls));
//     }

//     await onSubmit(productData);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
//         {isEditMode ? "Edit Product" : "Add New Product"}
//       </h1>
//       {(localError || error) && (
//         <p className="text-red-500 text-center mb-4">
//           {localError || error?.data?.message || "An error occurred"}
//         </p>
//       )}
//       {isLoading && <p className="text-gray-700 text-center mb-4">Processing...</p>}
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
//                           {isEditMode && (
//                             <button
//                               type="button"
//                               onClick={() => handleImageDelete(index, imgIndex)}
//                               className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                             >
//                               ×
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {isEditMode && formData.colors.length > 1 && (
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
//             disabled={isLoading}
//             className={`px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isLoading ? (isEditMode ? "Updating Product..." : "Adding Product...") : (isEditMode ? "Update Product" : "Add Product")}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;


import React, { useState } from "react";
import ImageCropper from "../common/ImageCropper"; // Adjust path as needed

const ProductForm = ({
  initialData = {
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    tags: "",
    isFeatured: false,
    colors: [{ name: "", stock: "", images: [] }],
  },
  categories = [],
  onSubmit,
  isLoading = false,
  error = null,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [deletedImages, setDeletedImages] = useState([]); // Used in both modes now
  const [localError, setLocalError] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle changes to color variant fields
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][field] = value;
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
  };

  // Add a new color variant
  const addColorVariant = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", stock: "", images: [] }],
    }));
  };

  // Remove a color variant (available in both modes now)
  const removeColorVariant = (index) => {
    const updatedColors = formData.colors.filter((_, i) => i !== index);
    const removedColor = formData.colors[index];
    if (removedColor.images.length > 0) {
      const urlsToDelete = removedColor.images.filter(
        (img) => typeof img === "string"
      );
      setDeletedImages((prev) => [...prev, ...urlsToDelete]);
    }
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
  };

  // Handle new cropped image addition
  const handleImageCrop = (index, croppedImage) => {
    const updatedColors = [...formData.colors];
    updatedColors[index].images = [
      ...updatedColors[index].images,
      croppedImage,
    ];
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
  };

  // Handle image deletion (available in both modes now)
  const handleImageDelete = (colorIndex, imageIndex) => {
    const updatedColors = [...formData.colors];
    const deletedImage = updatedColors[colorIndex].images[imageIndex];
    if (typeof deletedImage === "string") {
      setDeletedImages((prev) => [...prev, deletedImage]);
    }
    updatedColors[colorIndex].images = updatedColors[colorIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("discount", formData.discount || "0");
    productData.append("categoryId", formData.categoryId);
    productData.append("isFeatured", formData.isFeatured);
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim())
      : [];
    productData.append("tags", JSON.stringify(tagsArray));

    const colorsData = formData.colors.map((color) => ({
      name: color.name,
      stock: color.stock,
    }));
    productData.append("colors", JSON.stringify(colorsData));

    let totalImages = 0;
    let hasMissingImages = false;
    const updatedUrls = isEditMode ? [] : null; // Only used in edit mode

    formData.colors.forEach((color, index) => {
      if (color.images.length === 0) {
        setLocalError(
          `Please upload at least one image for color: ${color.name}`
        );
        hasMissingImages = true;
        return;
      }
      color.images.forEach((image) => {
        if (image instanceof File) {
          productData.append(`color${index}Images`, image);
        } else if (isEditMode && typeof image === "string") {
          updatedUrls.push(image);
        }
        totalImages++;
      });
    });

    if (hasMissingImages) return;
    if (totalImages < 3) {
      setLocalError(
        "Please ensure at least 3 images are present across all color variants."
      );
      return;
    }

    if (deletedImages.length > 0) {
      productData.append("deletedImages", JSON.stringify(deletedImages));
    }
    if (isEditMode && updatedUrls && updatedUrls.length > 0) {
      productData.append("updatedUrls", JSON.stringify(updatedUrls));
    }

    await onSubmit(productData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h1>
      {(localError || error) && (
        <p className="text-red-500 text-center mb-4">
          {localError || error?.data?.message || "An error occurred"}
        </p>
      )}
      {isLoading && (
        <p className="text-gray-700 text-center mb-4">Processing...</p>
      )}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="90"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., ceramic, handmade"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="isFeatured"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            Featured Product
          </label>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Color Variants
          </h3>
          {formData.colors.map((color, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color Name
                  </label>
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(index, "name", e.target.value)
                    }
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={color.stock}
                    onChange={(e) =>
                      handleColorChange(index, "stock", e.target.value)
                    }
                    min="0"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Images (at least 1 per variant)
                  </label>
                  <ImageCropper
                    onCropComplete={(croppedImage) =>
                      handleImageCrop(index, croppedImage)
                    }
                  />
                  {color.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {color.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={
                              image instanceof File
                                ? URL.createObjectURL(image)
                                : image
                            }
                            alt={`Color ${color.name} - ${imgIndex + 1}`}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageDelete(index, imgIndex)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {formData.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColorVariant(index)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove Color
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addColorVariant}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Another Color
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? isEditMode
                ? "Updating Product..."
                : "Adding Product..."
              : isEditMode
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;