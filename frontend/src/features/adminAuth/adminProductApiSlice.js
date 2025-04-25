
import { adminApi } from "../../services/api/adminApi";

export const adminProductApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    
    showProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    showProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }]
    }),
    
    addProduct: builder.mutation({
      query: (productData) => {
        for (let [key, value] of productData.entries()) {
        }
        return {
          url: "/products",
          method: "POST",
          body: productData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    
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
        for (let [key, value] of productData.entries()) {
        }
        return {
          url: `/products/${_id}`,
          method: "PUT",
          body: productData, 
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
