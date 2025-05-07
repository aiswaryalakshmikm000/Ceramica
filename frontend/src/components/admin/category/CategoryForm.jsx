

// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { X } from "lucide-react";

// const categorySchema = Yup.object().shape({
//   name: Yup.string()
//     .trim()
//     .required("Category name is required")
//     .min(2, "Category name must be at least 2 characters"),
//   description: Yup.string()
//     .trim()
//     .required("Category description is required")
//     .min(10, "Description must be at least 10 characters"),
//   image: Yup.mixed().required("Category image is required"),
// });

// const CategoryForm = ({
//   initialValues,
//   onSubmit,
//   isSubmitting,
//   title,
//   submitButtonText,
//   onClose,
//   existingImage,
// }) => {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-[#3c73a8]">{title}</h2>
//         {onClose && (
//           <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
//             <X size={20} />
//           </button>
//         )}
//       </div>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={categorySchema}
//         onSubmit={onSubmit}
//       >
//         {({ setFieldValue, errors, touched }) => (
//           <Form className="space-y-4" encType="multipart/form-data">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category Name
//               </label>
//               <Field
//                 type="text"
//                 name="name"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] ${
//                   errors.name && touched.name ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter category name"
//               />
//               <ErrorMessage
//                 name="name"
//                 component="div"
//                 className="text-sm text-red-600 mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <Field
//                 as="textarea"
//                 name="description"
//                 rows="3"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] ${
//                   errors.description && touched.description ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter category description"
//               />
//               <ErrorMessage
//                 name="description"
//                 component="div"
//                 className="text-sm text-red-600 mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category Image
//               </label>
//               {existingImage && (
//                 <img
//                   src={existingImage}
//                   alt="Current"
//                   className="w-16 h-16 object-cover rounded mb-2"
//                 />
//               )}
//               <div className="flex items-center gap-4">
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={(event) => {
//                     setFieldValue("image", event.currentTarget.files[0]);
//                   }}
//                   className={`flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#3c73a8] file:text-white hover:file:bg-[#2c5580] ${
//                     errors.image && touched.image ? "border-red-500" : ""
//                   }`}
//                 />
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`py-2 px-4 rounded-md text-white ${
//                     isSubmitting
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-[#3c73a8] hover:bg-[#2c5580]"
//                   }`}
//                 >
//                   {isSubmitting ? "Processing..." : submitButtonText}
//                 </button>
//               </div>
//               <ErrorMessage
//                 name="image"
//                 component="div"
//                 className="text-sm text-red-600 mt-1"
//               />
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default CategoryForm;




import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

const categorySchema = (isEditing) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters")
      .max(50, "Category name must be at most 50 characters")
      .matches(
        /^(?!\d+$)[a-zA-Z0-9\s]+$/,
        "Category name must include letters and not be only numbers"
      ),
    description: Yup.string()
      .trim()
      .required("Category description is required")
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description must be at most 200 characters")
      .matches(
        /^(?!\d+$).+$/,
        "Description must include letters and not be only numbers"
      ),
    image: isEditing
      ? Yup.mixed().nullable() 
      : Yup.mixed().required("Category image is required"),
  });

  const CategoryForm = ({
    initialValues,
    onSubmit,
    isSubmitting,
    title,
    submitButtonText,
    onClose,
    existingImage,
    isEditing = false, // New prop
  }) => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3c73a8]">{title}</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={20} />
            </button>
          )}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={categorySchema(isEditing)} // Pass isEditing to schema
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] text-sm sm:text-base ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter category name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] text-sm sm:text-base ${
                    errors.description && touched.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter category description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>
                {existingImage && (
                  <img
                    src={existingImage}
                    alt="Current"
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded mb-2"
                  />
                )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <input
                    type="file"
                    name="image"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                    }}
                    className={`flex-1 text-xs sm:text-sm text-gray-500 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#3c73a8] file:text-white hover:file:bg-[#2c5580] ${
                      errors.image && touched.image ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-white text-sm sm:text-base ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#3c73a8] hover:bg-[#2c5580]"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : submitButtonText}
                  </button>
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-xs sm:text-sm text-red-600 mt-1"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  };
  
  export default CategoryForm;