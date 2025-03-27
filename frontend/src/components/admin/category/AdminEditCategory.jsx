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
    <CategoryForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      title="Edit Category"
      submitButtonText="Update Category"
      onClose={handleCloseEdit}
      existingImage={editCategory.images}
    />
  );
};

export default EditCategory;

