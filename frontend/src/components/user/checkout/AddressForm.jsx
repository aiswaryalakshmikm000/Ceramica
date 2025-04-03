// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../../features/auth/userAuthSlice";
// import { useAddAddressMutation, useUpdateAddressMutation } from "../../../features/auth/userApiSlice";
// import { toast } from "react-toastify";
// import { X } from "lucide-react";

// const AddressForm = ({ existingAddress, onClose }) => {
//   const user = useSelector(selectUser);
//   const userId = user?._id;
  
//   const [addAddress] = useAddAddressMutation();
//   const [updateAddress] = useUpdateAddressMutation();
  
//   const [formData, setFormData] = useState({
//     name: existingAddress?.name || "",
//     phone: existingAddress?.phone || "",
//     street: existingAddress?.street || "",
//     landmark: existingAddress?.landmark || "",
//     city: existingAddress?.city || "",
//     state: existingAddress?.state || "",
//     pincode: existingAddress?.pincode || "",
//     isDefault: existingAddress?.isDefault || false
//   });
  
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//     else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    
//     if (!formData.street.trim()) newErrors.street = "Street address is required";
//     if (!formData.city.trim()) newErrors.city = "City is required";
//     if (!formData.state.trim()) newErrors.state = "State is required";
//     if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
//     else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     try {
//       if (existingAddress) {
//         await updateAddress({ 
//           addressId: existingAddress._id, 
//           userId, 
//           addressData: formData 
//         }).unwrap();
//         toast.success("Address updated successfully");
//       } else {
//         await addAddress({ userId, addressData: formData }).unwrap();
//         toast.success("Address added successfully");
//       }
//       onClose();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to save address");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">
//           {existingAddress ? "Edit Address" : "Add New Address"}
//         </h3>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           <X size={20} />
//         </button>
//       </div>
      
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded-md ${
//                 errors.name ? "border-red-800" : "border-gray-300"
//               }`}
//             />
//             {errors.name && (
//               <p className="text-red-800 text-xs mt-1">{errors.name}</p>
//             )}
//           </div>
          
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number *
//             </label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="10-digit mobile number"
//               className={`w-full p-2 border rounded-md ${
//                 errors.phone ? "border-red-800" : "border-gray-300"
//               }`}
//             />
//             {errors.phone && (
//               <p className="text-red-800 text-xs mt-1">{errors.phone}</p>
//             )}
//           </div>
          
//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Street Address *
//             </label>
//             <input
//               type="text"
//               name="street"
//               value={formData.street}
//               onChange={handleChange}
//               placeholder="House no., Building, Street, Area"
//               className={`w-full p-2 border rounded-md ${
//                 errors.street ? "border-red-800" : "border-gray-300"
//               }`}
//             />
//             {errors.street && (
//               <p className="text-red-800 text-xs mt-1">{errors.street}</p>
//             )}
//           </div>
          
//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Landmark
//             </label>
//             <input
//               type="text"
//               name="landmark"
//               value={formData.landmark}
//               onChange={handleChange}
//               placeholder="Landmark (Optional)"
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
          
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               City *
//             </label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded-md ${
//                 errors.city ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.city && (
//               <p className="text-red-500 text-xs mt-1">{errors.city}</p>
//             )}
//           </div>
          
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               State *
//             </label>
//             <input
//               type="text"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded-md ${
//                 errors.state ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.state && (
//               <p className="text-red-500 text-xs mt-1">{errors.state}</p>
//             )}
//           </div>
          
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Pincode *
//             </label>
//             <input
//               type="text"
//               name="pincode"
//               value={formData.pincode}
//               onChange={handleChange}
//               placeholder="6-digit pincode"
//               className={`w-full p-2 border rounded-md ${
//                 errors.pincode ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.pincode && (
//               <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
//             )}
//           </div>
//         </div>
        
//         <div className="mt-4">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               name="isDefault"
//               checked={formData.isDefault}
//               onChange={handleChange}
//               className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4 mr-2"
//             />
//             <span className="text-sm text-gray-600">Set as default address</span>
//           </label>
//         </div>
        
//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//           >
//             {existingAddress ? "Update Address" : "Save Address"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddressForm;