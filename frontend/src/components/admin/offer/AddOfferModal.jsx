// import React, { useState } from 'react';
// import { useAddOfferMutation } from '../../../features/adminAuth/adminOfferApiSlice';
// import { useShowProductsQuery } from '../../../features/adminAuth/adminProductApiSlice';
// import { useGetCategoriesQuery } from '../../../features/adminAuth/AdminCategoryApiSlice';
// import { toast } from 'react-toastify';
// import { X } from 'lucide-react';

// const AddOfferModal = ({ closeModal }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     targetType: 'Product',
//     targetId: '',
//     discountType: 'flat',
//     discountValue: '',
//     maxDiscountAmount: '',
//     validFrom: '',
//     expiryDate: '',
//   });

//   const [error, setError] = useState('');
//   const [addOffer, { isLoading: isAddingOffer }] = useAddOfferMutation();
//   const { data: productsData, isLoading: isProductsLoading, error: productsError } = useShowProductsQuery({
//     isListed: true,
//   });
//   const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery();

//   const products = productsData?.products || [];
//   const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'discountType' && value === 'flat' ? { maxDiscountAmount: '' } : {}),
//     }));
//     setError('');
//   };

//   const validateForm = () => {
//     const { name, targetType, targetId, discountType, discountValue, maxDiscountAmount, validFrom, expiryDate } =
//       formData;

//     if (!name) return 'Offer name is required';
//     if (name.length < 3 || name.length > 50) return 'Offer name must be between 3 and 50 characters';

//     if (!targetType) return 'Target type is required';
//     if (!targetId) return `Please select a ${targetType === 'Product' ? 'Product' : 'Category'}`;

//     if (!discountType) return 'Discount type is required';
//     if (!discountValue || discountValue < 1) return 'Discount value must be at least 1';
//     if (discountType === 'percentage' && discountValue > 80) {
//       return 'Discount percentage cannot exceed 80%';
//     }
//     if (discountType === 'percentage' && maxDiscountAmount && maxDiscountAmount < 0) {
//       return 'Maximum discount amount cannot be negative';
//     }

//     if (!validFrom) return 'Valid from date is required';
//     if (!expiryDate) return 'Expiry date is required';
//     if (new Date(expiryDate) <= new Date(validFrom)) {
//       return 'Expiry date must be after valid from date';
//     }
//     return '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       toast.error(validationError);
//       return;
//     }

//     // Prepare form data, excluding maxDiscountAmount for flat discounts
//     const submissionData = {
//       ...formData,
//       maxDiscountAmount: formData.discountType === 'percentage' ? formData.maxDiscountAmount || null : null,
//     };

//     try {
//       await addOffer(submissionData).unwrap();
//       toast.success('Offer added successfully');
//       closeModal();
//     } catch (err) {
//       setError(err?.data?.message || 'Failed to add offer');
//       toast.error(err?.data?.message || 'Failed to add offer');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-[#3c73a8]">Add New Offer</h2>
//           <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         {error && (
//           <div className="text-center mb-4">
//             <p className="text-red-500 font-medium">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Offer Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Offer Type</label>
//               <select
//                 name="targetType"
//                 value={formData.targetType}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//               >
//                 <option value="Product">Product</option>
//                 <option value="Category">Category</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               {formData.targetType === 'Product' ? 'Select Product' : 'Select Category'}
//             </label>
//             <select
//               name="targetId"
//               value={formData.targetId}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//               required
//             >
//               <option value="">Select</option>
//               {formData.targetType === 'Product' ? (
//                 isProductsLoading ? (
//                   <option disabled>Loading products...</option>
//                 ) : productsError ? (
//                   <option disabled>Error loading products: {productsError?.data?.message || 'Unknown error'}</option>
//                 ) : !products || products.length === 0 ? (
//                   <option disabled>No products available</option>
//                 ) : (
//                   products.map((product) => (
//                     <option key={product._id} value={product._id}>
//                       {product.name}
//                     </option>
//                   ))
//                 )
//               ) : isCategoriesLoading ? (
//                 <option disabled>Loading categories...</option>
//               ) : categoriesError ? (
//                 <option disabled>Error loading categories: {categoriesError?.data?.message || 'Unknown error'}</option>
//               ) : !categories || categories.length === 0 ? (
//                 <option disabled>No categories available</option>
//               ) : (
//                 categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Discount Type</label>
//               <select
//                 name="discountType"
//                 value={formData.discountType}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//               >
//                 <option value="flat">Flat</option>
//                 <option value="percentage">Percentage</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Discount Value</label>
//               <input
//                 type="number"
//                 name="discountValue"
//                 value={formData.discountValue}
//                 onChange={handleChange}
//                 min="1"
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//                 required
//               />
//             </div>
//           </div>

//           {formData.discountType === 'percentage' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Max Discount Amount</label>
//               <input
//                 type="number"
//                 name="maxDiscountAmount"
//                 value={formData.maxDiscountAmount}
//                 onChange={handleChange}
//                 min="0"
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//               />
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Valid From</label>
//               <input
//                 type="date"
//                 name="validFrom"
//                 value={formData.validFrom}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//               <input
//                 type="date"
//                 name="expiryDate"
//                 value={formData.expiryDate}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isAddingOffer}
//               className={`px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] ${
//                 isAddingOffer ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {isAddingOffer ? 'Adding...' : 'Add Offer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddOfferModal;



import React, { useState } from 'react';
import { useAddOfferMutation } from '../../../features/adminAuth/adminOfferApiSlice';
import { useShowProductsQuery } from '../../../features/adminAuth/adminProductApiSlice';
import { useGetCategoriesQuery } from '../../../features/adminAuth/AdminCategoryApiSlice';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const AddOfferModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetType: 'Product',
    targetId: '',
    discountValue: '',
    maxDiscountAmount: '',
    validFrom: '',
    expiryDate: '',
  });

  const [error, setError] = useState('');
  const [addOffer, { isLoading: isAddingOffer }] = useAddOfferMutation();
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useShowProductsQuery({
    isListed: true,
  });
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetCategoriesQuery();

  const products = productsData?.products || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    const { name, targetType, targetId, discountValue, maxDiscountAmount, validFrom, expiryDate } =
      formData;

    if (!name) return 'Offer name is required';
    if (name.length < 3 || name.length > 50) return 'Offer name must be between 3 and 50 characters';

    if (!targetType) return 'Target type is required';
    if (!targetId) return `Please select a ${targetType === 'Product' ? 'Product' : 'Category'}`;

    if (!discountValue || discountValue < 1) return 'Discount value must be at least 1';
    if (discountValue > 80) return 'Discount percentage cannot exceed 80%';
    if (maxDiscountAmount && maxDiscountAmount < 0) return 'Maximum discount amount cannot be negative';

    if (!validFrom) return 'Valid from date is required';
    if (!expiryDate) return 'Expiry date is required';
    if (new Date(expiryDate) <= new Date(validFrom)) {
      return 'Expiry date must be after valid from date';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const submissionData = {
      ...formData,
      discountType: 'percentage',
      maxDiscountAmount: formData.maxDiscountAmount || null,
    };

    try {
      await addOffer(submissionData).unwrap();
      toast.success('Offer added successfully');
      closeModal();
    } catch (err) {
      setError(err?.data?.message || 'Failed to add offer');
      toast.error(err?.data?.message || 'Failed to add offer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3c73a8]">Add New Offer</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="text-center mb-4">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Offer Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Offer Type</label>
              <select
                name="targetType"
                value={formData.targetType}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              >
                <option value="Product">Product</option>
                <option value="Category">Category</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {formData.targetType === 'Product' ? 'Select Product' : 'Select Category'}
            </label>
            <select
              name="targetId"
              value={formData.targetId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              required
            >
              <option value="">Select</option>
              {formData.targetType === 'Product' ? (
                isProductsLoading ? (
                  <option disabled>Loading products...</option>
                ) : productsError ? (
                  <option disabled>Error loading products: {productsError?.data?.message || 'Unknown error'}</option>
                ) : !products || products.length === 0 ? (
                  <option disabled>No products available</option>
                ) : (
                  products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))
                )
              ) : isCategoriesLoading ? (
                <option disabled>Loading categories...</option>
              ) : categoriesError ? (
                <option disabled>Error loading categories: {categoriesError?.data?.message || 'Unknown error'}</option>
              ) : !categories || categories.length === 0 ? (
                <option disabled>No categories available</option>
              ) : (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Discount Amount</label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid From</label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingOffer}
              className={`px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] ${
                isAddingOffer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAddingOffer ? 'Adding...' : 'Add Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOfferModal;