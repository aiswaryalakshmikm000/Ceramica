// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { X } from "lucide-react";

// // Validation schema using Yup
// const addressSchema = Yup.object().shape({
//   fullname: Yup.string().required("Full Name is required"),
//   phone: Yup.string()
//       .required("Phone number is required")
//       .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
//       .length(10, "Phone number must be exactly 10 digits"),
//   email: Yup.string()
//      .email("Invalid email address")
//      .required("Email is required")
//      .matches(/@gmail\.com$/, "Only Gmail addresses are allowed"),
//   addressLine: Yup.string().required("Address Line is required"),
//   city: Yup.string().required("City is required"),
//   state: Yup.string().required("State is required"),
//   pincode: Yup.string()
//     .matches(/^\d{6}$/, "Pincode must be a valid 6-digit number")
//     .required("Pincode is required"),
//   landmark: Yup.string().optional(),
//   addressType: Yup.string()
//     .oneOf(["Home", "Work"], "Address type must be Home or Work")
//     .required("Address type is required"),
//   isDefault: Yup.boolean(),
// });

// const AddressForm = ({
//   formData,
//   setFormData,
//   handleCloseForm,
//   editingAddress,
//   userId,
//   addAddress,
//   updateAddress,
// }) => {
//   const initialValues = {
//     fullname: formData.fullname || "",
//     phone: formData.phone || "",
//     email: formData.email || "",
//     addressLine: formData.addressLine || "",
//     city: formData.city || "",
//     state: formData.state || "",
//     pincode: formData.pincode || "",
//     landmark: formData.landmark || "",
//     addressType: formData.addressType || "Home",
//     isDefault: formData.isDefault || false,
//   };

//   const onSubmit = async (values, { setSubmitting }) => {
//     try {
//       if (editingAddress) {
//         const cleanFormData = {
//           fullname: values.fullname,
//           phone: values.phone,
//           email: values.email,
//           addressLine: values.addressLine,
//           city: values.city,
//           state: values.state,
//           landmark: values.landmark,
//           pincode: values.pincode,
//           addressType: values.addressType,
//           isDefault: values.isDefault,
//         };

//         const result = await updateAddress({
//           userId,
//           addressId: editingAddress._id,
//           addressData: cleanFormData,
//         }).unwrap();
//         toast.success(result.message);
//       } else {
//         const result = await addAddress({
//           userId,
//           addressData: { ...values, user: userId },
//         }).unwrap();
//         toast.success(result.message);
//       }
//       handleCloseForm();
//     } catch (err) {
//       console.error("Error saving address:", err);
//       toast.error(err?.data?.message || "Failed to save address");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold">
//               {editingAddress ? "Edit Address" : "Add New Address"}
//             </h3>
//             <button
//               onClick={handleCloseForm}
//               className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <Formik
//             initialValues={initialValues}
//             validationSchema={addressSchema}
//             onSubmit={onSubmit}
//           >
//             {({ isSubmitting, values, setFieldValue }) => (
//               <Form>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   {/* Left column - Personal info */}
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label
//                         htmlFor="fullname"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Full Name *
//                       </label>
//                       <Field
//                         id="fullname"
//                         name="fullname"
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="fullname"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label
//                         htmlFor="phone"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Phone *
//                       </label>
//                       <Field
//                         id="phone"
//                         name="phone"
//                         maxLength="10"
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="phone"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label
//                         htmlFor="email"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Email *
//                       </label>
//                       <Field
//                         id="email"
//                         type="email"
//                         name="email"
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="flex items-center">
//                       <Field
//                         type="checkbox"
//                         id="isDefault"
//                         name="isDefault"
//                         className="h-4 w-4 text-gray-600 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="isDefault"
//                         className="ml-2 block text-sm text-gray-700"
//                       >
//                         Set as default address
//                       </label>
//                     </div>
//                   </div>

//                   {/* Right column - Address details */}
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <label
//                         htmlFor="addressLine"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Address Line *
//                       </label>
//                       <Field
//                         id="addressLine"
//                         name="addressLine"
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                       />
//                       <ErrorMessage
//                         name="addressLine"
//                         component="div"
//                         className="text-red-500 text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="city"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           City *
//                         </label>
//                         <Field
//                           id="city"
//                           name="city"
//                           className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                         <ErrorMessage
//                           name="city"
//                           component="div"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="state"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           State *
//                         </label>
//                         <Field
//                           id="state"
//                           name="state"
//                           className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                         <ErrorMessage
//                           name="state"
//                           component="div"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="pincode"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Pincode *
//                         </label>
//                         <Field
//                           id="pincode"
//                           name="pincode"
//                           maxLength="6"
//                           className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                         <ErrorMessage
//                           name="pincode"
//                           component="div"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label
//                           htmlFor="landmark"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Landmark
//                         </label>
//                         <Field
//                           id="landmark"
//                           name="landmark"
//                           className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                         <ErrorMessage
//                           name="landmark"
//                           component="div"
//                           className="text-red-500 text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex space-x-4">
//                       <div className="flex items-center">
//                         <Field
//                           type="radio"
//                           id="addressTypeHome"
//                           name="addressType"
//                           value="Home"
//                           className="h-4 w-4 text-gray-600 border-gray-300"
//                         />
//                         <label
//                           htmlFor="addressTypeHome"
//                           className="ml-2 text-sm text-gray-700"
//                         >
//                           Home
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <Field
//                           type="radio"
//                           id="addressTypeWork"
//                           name="addressType"
//                           value="Work"
//                           className="h-4 w-4 text-gray-600 border-gray-300"
//                         />
//                         <label
//                           htmlFor="addressTypeWork"
//                           className="ml-2 text-sm text-gray-700"
//                         >
//                           Work
//                         </label>
//                       </div>
//                     </div>
//                     <ErrorMessage
//                       name="addressType"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-6">
//                   <button
//                     type="button"
//                     onClick={handleCloseForm}
//                     className="px-4 py-2 border border-grey-700 rounded-md text-orange-800  hover:border-orange-800"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-4 py-2 bg-orange-800/90 text-white rounded-md hover:bg-orange-800 disabled:bg-gray-500"
//                   >
//                     {editingAddress ? "Update" : "Save"} Address
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressForm;




import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { X } from "lucide-react";

// Validation schema using Yup
const addressSchema = Yup.object().shape({
  fullname: Yup.string().required("Full Name is required"),
  phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .length(10, "Phone number must be exactly 10 digits"),
  email: Yup.string()
     .email("Invalid email address")
     .required("Email is required")
     .matches(/@gmail\.com$/, "Only Gmail addresses are allowed"),
  addressLine: Yup.string().required("Address Line is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be a valid 6-digit number")
    .required("Pincode is required"),
  landmark: Yup.string().optional(),
  addressType: Yup.string()
    .oneOf(["Home", "Work"], "Address type must be Home or Work")
    .required("Address type is required"),
  isDefault: Yup.boolean(),
});

const AddressForm = ({
  formData,
  setFormData,
  handleCloseForm,
  editingAddress,
  userId,
  addAddress,
  updateAddress,
}) => {
  const initialValues = {
    fullname: formData.fullname || "",
    phone: formData.phone || "",
    email: formData.email || "",
    addressLine: formData.addressLine || "",
    city: formData.city || "",
    state: formData.state || "",
    pincode: formData.pincode || "",
    landmark: formData.landmark || "",
    addressType: formData.addressType || "Home",
    isDefault: formData.isDefault || false,
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingAddress) {
        const cleanFormData = {
          fullname: values.fullname,
          phone: values.phone,
          email: values.email,
          addressLine: values.addressLine,
          city: values.city,
          state: values.state,
          landmark: values.landmark,
          pincode: values.pincode,
          addressType: values.addressType,
          isDefault: values.isDefault,
        };

        const result = await updateAddress({
          userId,
          addressId: editingAddress._id,
          addressData: cleanFormData,
        }).unwrap();
        toast.success(result.message);
      } else {
        const result = await addAddress({
          userId,
          addressData: { ...values, user: userId },
        }).unwrap();
        toast.success(result.message);
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(err?.data?.message || "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg sm:max-w-3xl bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={handleCloseForm}
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={addressSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left column - Personal info */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name *
                      </label>
                      <Field
                        id="fullname"
                        name="fullname"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                      />
                      <ErrorMessage
                        name="fullname"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone *
                      </label>
                      <Field
                        id="phone"
                        name="phone"
                        maxLength="10"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email *
                      </label>
                      <Field
                        id="email"
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        className="h-4 w-4 text-gray-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isDefault"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Set as default address
                      </label>
                    </div>
                  </div>

                  {/* Right column - Address details */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="addressLine"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address Line *
                      </label>
                      <Field
                        id="addressLine"
                        name="addressLine"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                      />
                      <ErrorMessage
                        name="addressLine"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City *
                        </label>
                        <Field
                          id="city"
                          name="city"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State *
                        </label>
                        <Field
                          id="state"
                          name="state"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="pincode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Pincode *
                        </label>
                        <Field
                          id="pincode"
                          name="pincode"
                          maxLength="6"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="pincode"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="landmark"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Landmark
                        </label>
                        <Field
                          id="landmark"
                          name="landmark"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="landmark"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Field
                          type="radio"
                          id="addressTypeHome"
                          name="addressType"
                          value="Home"
                          className="h-4 w-4 text-gray-600 border-gray-300"
                        />
                        <label
                          htmlFor="addressTypeHome"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Home
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Field
                          type="radio"
                          id="addressTypeWork"
                          name="addressType"
                          value="Work"
                          className="h-4 w-4 text-gray-600 border-gray-300"
                        />
                        <label
                          htmlFor="addressTypeWork"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Work
                        </label>
                      </div>
                    </div>
                    <ErrorMessage
                      name="addressType"
                      component="div"
                      className="text-red-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-grey-700 rounded-md text-orange-800 hover:border-orange-800 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-800/90 text-white rounded-md hover:bg-orange-800 disabled:bg-gray-500 text-sm sm:text-base"
                  >
                    {editingAddress ? "Update" : "Save"} Address
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;