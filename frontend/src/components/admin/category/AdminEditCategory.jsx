
import React from "react";
import { toast } from "react-toastify";
import CategoryForm from "./CategoryForm";

const EditCategory = ({
  editCategory,
  setEditCategory,
  updateCategory,
  isUpdating,
}) => {
  const initialValues = {
    name: editCategory.name,
    description: editCategory.description,
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const result = await updateCategory({
        catId: editCategory._id,
        formData,
      }).unwrap();
      setEditCategory(null);
      toast.success(result.message || "Category updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseEdit = () => {
    setEditCategory(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <CategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          title="Edit Category"
          submitButtonText="Update"
          onClose={handleCloseEdit}
          existingImage={editCategory.images}
        />
      </div>
    </div>
  );
};

export default EditCategory;