
import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageCropper from "../../common/ImageCropper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "../../common/BreadCrumbs";

const productValidationSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  description: Yup.string()
    .required("Product description is required")
    .min(10, "Description must be at least 10 characters"),
  price: Yup.number()
    .required("Product price is required")
    .min(0, "Price cannot be negative")
    .test(
      "maxDigitsAfterDecimal",
      "Price must have no more than 2 decimal places",
      (number) => !number || /^\d+(\.\d{1,2})?$/.test(number.toString())
    ),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(90, "Discount cannot exceed 90%")
    .nullable()
    .default(0),
  categoryId: Yup.string().required("Category is required"),
  tags: Yup.string(),
  isFeatured: Yup.boolean().default(false),
  colors: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Color name is required"),
        stock: Yup.number()
          .required("Stock is required")
          .min(0, "Stock cannot be negative")
          .integer("Stock must be a whole number"),
        images: Yup.array()
          .of(Yup.mixed())
          .min(1, "At least one image is required per color variant")
      })
    )
    .min(1, "At least one color variant is required")
    .test(
      "totalImages",
      "At least 3 images are required across all color variants",
      (colors) => {
        if (!colors) return false;
        const totalImages = colors.reduce(
          (sum, color) => sum + (color.images?.length || 0),
          0
        );
        return totalImages >= 3;
      }
    ),
});

const ProductForm = ({
  initialData = {
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    tags: "",
    isFeatured: false,
    colors: [{ name: "", stock: "", images: [] }],
  },
  categories = [],
  onSubmit,
  isLoading = false,
  error = null,
  isEditMode = false,
  breadcrumbItems = [], // Added for breadcrumbs
}) => {
  const [deletedImages, setDeletedImages] = useState([]);

  const handleFormSubmit = async (values, { resetForm }) => {
    const productData = new FormData();
    productData.append("name", values.name);
    productData.append("description", values.description);
    productData.append("price", values.price);
    productData.append("discount", values.discount || "0");
    productData.append("categoryId", values.categoryId);
    productData.append("isFeatured", values.isFeatured);
    const tagsArray = values.tags
      ? values.tags.split(",").map((tag) => tag.trim())
      : [];
    productData.append("tags", JSON.stringify(tagsArray));

    const colorsData = values.colors.map((color) => ({
      name: color.name,
      stock: color.stock,
    }));
    productData.append("colors", JSON.stringify(colorsData));

    values.colors.forEach((color, index) => {
      color.images.forEach((image) => {
        if (image instanceof File) {
          productData.append(`color${index}Images`, image);
        }
      });
    });

    if (deletedImages.length > 0) {
      productData.append("deletedImages", JSON.stringify(deletedImages));
    }
    if (isEditMode) {
      const updatedUrls = values.colors
        .flatMap((color) => color.images)
        .filter((img) => typeof img === "string");
      if (updatedUrls.length > 0) {
        productData.append("updatedUrls", JSON.stringify(updatedUrls));
      }
    }

    try {
      await onSubmit(productData);
      if (!isEditMode) {
        resetForm();
        setDeletedImages([]);
      }
    } catch (err) {
      const errorMessage = err?.data?.message || "An error occurred while saving the product";
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {/* Header with Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600">Manage product details and variants</p>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {error && (
            <p className="text-red-500 text-center mb-4">
              {error?.data?.message || "An error occurred"}
            </p>
          )}
          {isLoading && (
            <p className="text-gray-700 text-center mb-4">Processing...</p>
          )}

          <Formik
            initialValues={initialData}
            validationSchema={productValidationSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, setFieldValue, isSubmitting, errors }) => (
              <Form encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                    />
                    <ErrorMessage
                      name="name"
                      render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <Field
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                    />
                    <ErrorMessage
                      name="price"
                      render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="4"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                  />
                  <ErrorMessage
                    name="description"
                    render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <Field
                      type="number"
                      id="discount"
                      name="discount"
                      min="0"
                      max="90"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                    />
                    <ErrorMessage
                      name="discount"
                      render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Field
                      as="select"
                      id="categoryId"
                      name="categoryId"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="categoryId"
                      render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <Field
                    type="text"
                    id="tags"
                    name="tags"
                    placeholder="e.g., ceramic, handmade"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                  />
                  <ErrorMessage
                    name="tags"
                    render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                  />
                </div>

                <div>
                  <label htmlFor="isFeatured" className="flex items-center text-sm font-medium text-gray-700">
                    <Field
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      className="mr-2 h-4 w-4 text-[#3c73a8] border-gray-300 rounded focus:ring-[#3c73a8]"
                    />
                    Featured Product
                  </label>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Color Variants</h3>
                  <FieldArray name="colors">
                    {({ push, remove }) => (
                      <>
                        {values.colors.map((color, index) => (
                          <div
                            key={index}
                            className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Color Name
                                </label>
                                <Field
                                  type="text"
                                  name={`colors.${index}.name`}
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                                />
                                <ErrorMessage
                                  name={`colors.${index}.name`}
                                  render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Stock
                                </label>
                                <Field
                                  type="number"
                                  name={`colors.${index}.stock`}
                                  min="0"
                                  className="mt-1 block w-full p-2 border border-gray-300 Rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8] focus:border-transparent"
                                />
                                <ErrorMessage
                                  name={`colors.${index}.stock`}
                                  render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Images (at least 1 per variant)
                                </label>
                                <ImageCropper
                                  onCropComplete={(croppedImage) => {
                                    const currentImages = values.colors[index].images || [];
                                    setFieldValue(`colors.${index}.images`, [
                                      ...currentImages,
                                      croppedImage,
                                    ]);
                                  }}
                                />
                                {color.images.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {color.images.map((image, imgIndex) => (
                                      <div key={imgIndex} className="relative">
                                        <img
                                          src={
                                            image instanceof File
                                              ? URL.createObjectURL(image)
                                              : image
                                          }
                                          alt={`Color ${color.name || "variant"} - ${imgIndex + 1}`}
                                          className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedImages = color.images.filter(
                                              (_, i) => i !== imgIndex
                                            );
                                            setFieldValue(`colors.${index}.images`, updatedImages);
                                            if (typeof image === "string") {
                                              setDeletedImages((prev) => [...prev, image]);
                                            }
                                          }}
                                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <ErrorMessage
                                  name={`colors.${index}.images`}
                                  render={(msg) => <p className="text-red-500 text-sm mt-1">{msg}</p>}
                                />
                              </div>
                            </div>
                            {values.colors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const removedColor = values.colors[index];
                                  if (removedColor.images.length > 0) {
                                    const urlsToDelete = removedColor.images.filter(
                                      (img) => typeof img === "string"
                                    );
                                    setDeletedImages((prev) => [...prev, ...urlsToDelete]);
                                  }
                                  remove(index);
                                }}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                Remove Color
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ name: "", stock: "", images: [] })}
                          className="mt-2 px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                        >
                          Add Another Color
                        </button>
                        {errors.colors && typeof errors.colors === "string" && (
                          <p className="text-red-500 text-sm mt-1">{errors.colors}</p>
                        )}
                      </>
                    )}
                  </FieldArray>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className={`px-6 py-3 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8] ${
                      isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting || isLoading
                      ? isEditMode
                        ? "Updating Product..."
                        : "Adding Product..."
                      : isEditMode
                      ? "Update Product"
                      : "Add Product"}
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

export default ProductForm;