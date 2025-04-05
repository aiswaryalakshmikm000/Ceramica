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
//     <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
//         {onClose && (
//           <button onClick={onClose} className="text-gray-600">
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
//           <Form className="space-y-6" encType="multipart/form-data">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Category Name
//               </label>
//               <Field
//                 type="text"
//                 name="name"
//                 className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 ${
//                   errors.name && touched.name
//                     ? "border-red-500"
//                     : "border-gray-200"
//                 }`}
//                 placeholder="Enter category name"
//               />
//               <ErrorMessage
//                 name="name"
//                 component="div"
//                 className="mt-1 text-sm text-red-600"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description
//               </label>
//               <Field
//                 as="textarea"
//                 name="description"
//                 rows="3"
//                 className={`mt-1 block w-full rounded-lg border bg-gray-50 px-4 py-3 ${
//                   errors.description && touched.description
//                     ? "border-red-500"
//                     : "border-gray-200"
//                 }`}
//                 placeholder="Enter category description"
//               />
//               <ErrorMessage
//                 name="description"
//                 component="div"
//                 className="mt-1 text-sm text-red-600"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Category Image
//               </label>
//               {existingImage && (
//                 <img
//                   src={existingImage}
//                   alt="Current"
//                   className="w-24 h-24 object-cover mb-2 rounded"
//                 />
//               )}
//               <input
//                 type="file"
//                 name="image"
//                 onChange={(event) => {
//                   setFieldValue("image", event.currentTarget.files[0]);
//                 }}
//                 className={`mt-1 block w-full ${
//                   errors.image && touched.image
//                     ? "border-red-500"
//                     : "border-gray-200"
//                 }`}
//               />
//               <ErrorMessage
//                 name="image"
//                 component="div"
//                 className="mt-1 text-sm text-red-600"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`inline-flex items-center px-6 py-3 rounded-lg text-white ${
//                 isSubmitting
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {isSubmitting ? "Processing..." : submitButtonText}
//             </button>
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

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters"),
  description: Yup.string()
    .trim()
    .required("Category description is required")
    .min(10, "Description must be at least 10 characters"),
  image: Yup.mixed().required("Category image is required"),
});

const CategoryForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  title,
  submitButtonText,
  onClose,
  existingImage,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#3c73a8]">{title}</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        )}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={categorySchema}
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
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] ${
                  errors.name && touched.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter category name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-600 mt-1"
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
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] ${
                  errors.description && touched.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter category description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-sm text-red-600 mt-1"
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
                  className="w-16 h-16 object-cover rounded mb-2"
                />
              )}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  name="image"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className={`flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#3c73a8] file:text-white hover:file:bg-[#2c5580] ${
                    errors.image && touched.image ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-4 rounded-md text-white ${
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
                className="text-sm text-red-600 mt-1"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;