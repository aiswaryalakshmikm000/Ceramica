// import React from "react";
// import { useAddCategoryMutation } from "../../features/categories/AdminCategoryApiSlice";
// import { toast } from "react-toastify";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Yup validation schema aligned with Mongoose schema
// const categorySchema = Yup.object().shape({
//   name: Yup.string()
//     .trim()
//     .required("Category name is required") // Matches required: [true, "Category name is required"]
//     .min(2, "Category name must be at least 2 characters"),
//   description: Yup.string()
//     .trim()
//     .required("Category description is required") // Matches required: [true, "Category description is required"]
//     .min(10, "Description must be at least 10 characters"),
//   image: Yup.mixed()
//     .required("Category image is required"), // Matches required: true for images
// });

// const AddCategory = () => {
//   const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

//   const initialValues = {
//     name: "",
//     description: "",
//     image: null,
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("description", values.description);
//       formData.append("image", values.image); // Image is required

//       const result = await addCategory(formData).unwrap();
//       resetForm();
//       toast.success(result.message || "Category added successfully");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to add category");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h2>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={categorySchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, setFieldValue, errors, touched }) => (
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
//               disabled={isAdding || isSubmitting}
//               className={`inline-flex items-center px-6 py-3 rounded-lg text-white ${
//                 isAdding || isSubmitting
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {isAdding || isSubmitting ? "Adding..." : "Add Category"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddCategory;


import React from "react";
import { useAddCategoryMutation } from "../../features/categories/AdminCategoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "./CategoryForm";

const AddCategory = () => {
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

  const initialValues = {
    name: "",
    description: "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image);

      const result = await addCategory(formData).unwrap();
      resetForm();
      toast.success(result.message || "Category added successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CategoryForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isAdding}
      title="Add New Category"
      submitButtonText="Add Category"
    />
  );
};

export default AddCategory;