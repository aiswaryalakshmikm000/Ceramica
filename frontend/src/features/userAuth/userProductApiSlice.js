
import { userApi } from "../../services/api/userApi";

export const userProductApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    fetchFeaturedProducts: builder.query({
      query: (params) => ({
        url: "/products/featured",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    viewProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => {
        return {
          product: response.product,
          relatedProducts: response.relatedProducts || []
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }]
    }),
  })
});

export const {
  useFetchProductsQuery,
  useFetchFeaturedProductsQuery,
  useViewProductQuery,
} = userProductApiSlice;