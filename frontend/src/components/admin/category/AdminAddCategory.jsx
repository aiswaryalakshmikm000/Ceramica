// import React from "react";
// import { useAddCategoryMutation } from "../../../features/adminAuth/AdminCategoryApiSlice";
// import { toast } from "react-toastify";
// import CategoryForm from "./CategoryForm";

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
//       formData.append("image", values.image);

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
//     <CategoryForm
//       initialValues={initialValues}
//       onSubmit={handleSubmit}
//       isSubmitting={isAdding}
//       title="Add New Category"
//       submitButtonText="Add Category"
//     />
//   );
// };

// export default AddCategory;


import React from "react";
import { useAddCategoryMutation } from "../../../features/adminAuth/AdminCategoryApiSlice";
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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isAdding}
        title="Add New Category"
        submitButtonText="Add Category"
      />
    </div>
  );
};

export default AddCategory;