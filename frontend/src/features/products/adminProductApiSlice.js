
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
        console.log("FormData being sent:", productData); // Log FormData
        for (let [key, value] of productData.entries()) {
          console.log(`FormData entry - ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
        }
        return {
          url: "/products",
          method: "POST",
          body: productData,
        };
      },
      invalidatesTags: ["Product"],
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
    editProduct: builder.mutation({
      query: ({ _id, productData }) => {
        console.log("FormData being sent:", productData);
        for (let [key, value] of productData.entries()) {
          console.log(`FormData entry - ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
        }
        return {
          url: `/products/${_id}`,
          method: "PUT",
          body: productData, // Use the original FormData directly
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
