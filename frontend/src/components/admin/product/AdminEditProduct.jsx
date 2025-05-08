
import { useParams, useNavigate } from "react-router-dom";
import { useEditProductMutation, useShowProductQuery } from "../../../features/adminAuth/adminProductApiSlice";
import { useGetCategoriesQuery } from "../../../features/adminAuth/AdminCategoryApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "./ProductForm";
import Sidebar from "../SideBar";

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading: productLoading, error: productError } = useShowProductQuery(id);
  const [editProduct, { isLoading: editLoading, error: editError }] = useEditProductMutation();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

  const categories = categoriesData?.categories || [];
  const product = productData?.product;

  const handleSubmit = async (productData) => {
    try {
      const response = await editProduct({ _id: id, productData }).unwrap();
      toast.success(response.message || "Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      const errorMessage = err?.data?.message || "Something went wrong while editing the product.";
      toast.error(errorMessage);
    }
  };

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Products", href: "/admin/products" },
    { label: "Edit Product", href: `/admin/products/edit/${id}` },
  ];

  if (productLoading || categoriesLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-10 text-gray-500">Loading...</div>
        </main>
      </div>
    );
  }

  if (productError || categoriesError) {
    const errorMessage = productError?.data?.message || categoriesError?.data?.message || "Error loading data";
    toast.error(errorMessage);
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-10 text-red-500">{errorMessage}</div>
        </main>
      </div>
    );
  }

  if (!product) {
    toast.error("Product not found");
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-10 text-gray-500">Product not found.</div>
        </main>
      </div>
    );
  }

  const initialData = {
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    discount: product.discount || "0",
    categoryId: product.categoryId._id || "",
    tags: product.tags ? product.tags.join(", ") : "",
    isFeatured: product.isFeatured || false,
    colors: product.colors.length > 0
      ? product.colors.map((color) => ({
          name: color.name,
          stock: color.stock,
          images: color.images || [],
        }))
      : [{ name: "", stock: "", images: [] }],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <ProductForm
        initialData={initialData}
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={editLoading}
        isEditMode={true}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

export default AdminEditProductPage;