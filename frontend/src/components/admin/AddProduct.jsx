// import React, { useState } from 'react';
// import { useAddProductMutation } from '../../features/products/adminProductApiSlice';
// import { useDispatch } from 'react-redux';
// import { addProduct } from '../../features/products/adminProductSlice'; // Assuming this is the correct path
// import { useNavigate } from 'react-router-dom';

// const AdminAddProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     discount: '',
//     offerId: '', // Optional
//     categoryId: '',
//     tags: '', // Comma-separated string
//     colors: [{ name: '', stock: ''}], // Array of color objects
//   });
//   const [images, setImages] = useState([]); // Array of File objects
//   const [errorMsg, setErrorMsg] = useState('');
//   const [addProductMutation, { isLoading }] = useAddProductMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Handle text input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle color input changes
//   const handleColorChange = (index, field, value) => {
//     const updatedColors = [...formData.colors];
//     updatedColors[index] = { ...updatedColors[index], [field]: value };
//     setFormData({ ...formData, colors: updatedColors });
//   };

//   // Add a new color field
//   const addColorField = () => {
//     setFormData({ ...formData, colors: [...formData.colors, { name: '', stock: '' }] });
//   };

//   // Remove a color field
//   const removeColorField = (index) => {
//     const updatedColors = formData.colors.filter((_, i) => i !== index);
//     setFormData({ ...formData, colors: updatedColors });
//   };

//   // Handle image file input
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + images.length > 4) {
//       setErrorMsg('Maximum 4 images allowed.');
//       return;
//     }
//     setImages([...images, ...files]);
//   };

//   // Remove an image
//   const removeImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg('');

//     // Validation
//     if (!formData.name) return setErrorMsg('Product name is required.');
//     if (!formData.description) return setErrorMsg('Description is required.');
//     if (!formData.price || isNaN(formData.price) || formData.price < 0) {
//       return setErrorMsg('Valid price is required.');
//     }
//     if (formData.discount && (isNaN(formData.discount) || formData.discount < 0 || formData.discount > 90)) {
//       return setErrorMsg('Discount must be between 0 and 90.');
//     }
//     if (!formData.categoryId) return setErrorMsg('Category ID is required.');
//     if (images.length < 3) return setErrorMsg('At least 3 images are required.');
//     for (const color of formData.colors) {
//       if (!color.name || !color.stock || isNaN(color.stock) || color.stock < 0) {
//         return setErrorMsg('All colors must have a name and valid stock.');
//       }
//     }

//     // Prepare FormData
//     const productData = new FormData();
//     productData.append('name', formData.name);
//     productData.append('description', formData.description);
//     productData.append('price', formData.price);
//     if (formData.discount) productData.append('discount', formData.discount);
//     if (formData.offerId) productData.append('offerId', formData.offerId);
//     productData.append('categoryId', formData.categoryId);
//     if (formData.tags) productData.append('tags', formData.tags.split(',').map(tag => tag.trim()));
//     productData.append('colors', JSON.stringify(formData.colors));
//     images.forEach(image => productData.append('images', image));

//     try {
//       const response = await addProductMutation(productData).unwrap();
//       dispatch(addProduct(response.product)); // Add to Redux state
//       navigate('/admin/products', { state: { message: 'Product added successfully!' } });
//     } catch (err) {
//       setErrorMsg(err?.data?.message || 'Failed to add product.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-2xl w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Add New Product</h2>
//           <p className="mt-2 text-sm text-gray-600">Fill in the details to add a product</p>
//         </div>

//         {errorMsg && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{errorMsg}</span>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 gap-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Product Name"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Product Description"
//                 rows="3"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
//               <input
//                 id="price"
//                 name="price"
//                 type="number"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Price"
//                 min="0"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
//               <input
//                 id="discount"
//                 name="discount"
//                 type="number"
//                 value={formData.discount}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Discount (0-90)"
//                 min="0"
//                 max="90"
//               />
//             </div>
//             <div>
//               <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category ID</label>
//               <input
//                 id="categoryId"
//                 name="categoryId"
//                 type="text"
//                 value={formData.categoryId}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Category ID"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
//               <input
//                 id="tags"
//                 name="tags"
//                 type="text"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., tag1, tag2, tag3"
//               />
//             </div>

//             {/* Colors Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Colors</label>
//               {formData.colors.map((color, index) => (
//                 <div key={index} className="flex space-x-4 mt-2">
//                   <input
//                     type="text"
//                     placeholder="Color Name"
//                     value={color.name}
//                     onChange={(e) => handleColorChange(index, 'name', e.target.value)}
//                     className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     required
//                   />
//                   <input
//                     type="number"
//                     placeholder="Stock"
//                     value={color.stock}
//                     onChange={(e) => handleColorChange(index, 'stock', e.target.value)}
//                     className="block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     min="0"
//                     required
//                   />
//                   {formData.colors.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeColorField(index)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addColorField}
//                 className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
//               >
//                 + Add Color
//               </button>
//             </div>

//             {/* Images Section */}
//             <div>
//               <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images (min 3, max 4)</label>
//               <input
//                 id="images"
//                 name="images"
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               />
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {images.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={URL.createObjectURL(image)}
//                       alt={`Preview ${index + 1}`}
//                       className="h-20 w-20 object-cover rounded"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {isLoading ? 'Adding Product...' : 'Add Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminAddProduct;