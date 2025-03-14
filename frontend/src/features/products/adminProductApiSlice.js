
import { adminApi } from "../../services/api/adminApi";

export const adminProductApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products (with filters) - Admin view 
    showProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    // Get single product by ID - Admin view
    showProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }]
    }),
    
    // Add new product
    addProduct: builder.mutation({
      query: (productData) => {
        // Handle FormData for image uploads instaed of json
        const formData = new FormData();
        
        // Add text fields
        Object.keys(productData).forEach(key => {
          if (key !== 'images') {
            formData.append(key, 
              typeof productData[key] === 'object' ? 
              JSON.stringify(productData[key]) : productData[key]);   // FormData only supports text and files, not objects.
          }
        });
        
        // Add image files
        if (productData.images) {
          productData.images.forEach(image => {
            formData.append('images', image);
          });
        }
        
        return {
          url: "/products",
          method: "POST",
          body: formData,
          // Don't set Content-Type - browser will set it with boundary for FormData
          formData: true
        };
      },
      invalidatesTags: ["Product"]
    }),
    
    // Update product status (list/unlist)
    updateProductStatus: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "Product"
      ]
    }),
    
    // Edit product
    editProduct: builder.mutation({
      query: ({ _id, productData }) => {
        // Handle FormData for image uploads
        const formData = new FormData();
        
        // Add text fields
        Object.keys(productData).forEach(key => {
          if (key !== 'images' && key !== 'deletedImages' && key !== 'updatedUrls') {
            formData.append(key, 
              typeof productData[key] === 'object' ? 
              JSON.stringify(productData[key]) : productData[key]);
          }
        });
        
        // Add deleted images array if exists
        if (productData.deletedImages) {
          formData.append('deletedImages', JSON.stringify(productData.deletedImages));
        }
        
        // Add updated URLs array if exists
        if (productData.updatedUrls) {
          formData.append('updatedUrls', JSON.stringify(productData.updatedUrls));
        }
        
        // Add new image files
        if (productData.images) {
          productData.images.forEach(image => {
            if (image instanceof File) { // Only append File objects
              formData.append('images', image);
            }
          });
        }
        
        return {
          url: `/products/${_id}`,
          method: "PUT",
          body: formData,
          formData: true
        };
      },
      invalidatesTags: (result, error, { _id }) => [
        { type: "Product", id: String(_id) }, 
        "Product"
      ]
    })
  })
});

export const {
  useShowProductsQuery,
  useShowProductQuery,
  useAddProductMutation,
  useUpdateProductStatusMutation,
  useEditProductMutation
} = adminProductApiSlice;
