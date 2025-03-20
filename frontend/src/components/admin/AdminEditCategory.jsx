// import React from "react";
// import { toast } from "react-toastify";
// import { X } from "lucide-react";

// const EditCategory = ({
//   editCategory,
//   setEditCategory,
//   updateCategory,
//   isUpdating,
// }) => {
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditCategory((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditImageChange = (e) => {
//     const file = e.target.files[0];
//     setEditCategory((prev) => ({ ...prev, image: file }));
//   };

//   const handleEditCategory = async (e) => {
//     e.preventDefault();
//     if (!editCategory.name || !editCategory.description) {
//       toast.error("Name and description are required");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", editCategory.name);
//       formData.append("description", editCategory.description);
//       if (editCategory.image instanceof File) {
//         formData.append("image", editCategory.image);
//       }

//       const result = await updateCategory({
//         catId: editCategory._id,
//         formData,
//       }).unwrap();
//       setEditCategory(null);
//       toast.success(result.message || "Category updated successfully");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update category");
//     }
//   };

//   const handleCloseEdit = () => {
//     setEditCategory(null);
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Edit Category</h2>
//         <button onClick={handleCloseEdit} className="text-gray-600">
//           <X size={20} />
//         </button>
//       </div>
//       <form
//         onSubmit={handleEditCategory}
//         className="space-y-6"
//         encType="multipart/form-data"
//       >
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Category Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={editCategory.name}
//             onChange={handleEditInputChange}
//             className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={editCategory.description}
//             onChange={handleEditInputChange}
//             rows="3"
//             className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Category Image
//           </label>
//           {editCategory.images && (
//             <img
//               src={editCategory.images}
//               alt="Current"
//               className="w-24 h-24 object-cover mb-2 rounded"
//             />
//           )}
//           <input
//             type="file"
//             name="image"
//             onChange={handleEditImageChange}
//             accept="image/*"
//             className="mt-1 block w-full"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={isUpdating}
//           className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
//         >
//           {isUpdating ? "Updating..." : "Update Category"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditCategory;


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