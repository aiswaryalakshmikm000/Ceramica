import { userApi } from "../../services/api/userApi";

export const userProductApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products (with filters) - User view
    fetchProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    // Get featured products
    fetchFeaturedProducts: builder.query({
      query: (params) => ({
        url: "/products/featured",
        method: "GET",
        params
      }),
      providesTags: ["Product"]
    }),
    
    // Get single product by ID - User view
    viewProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => {
        // Transform response to extract product and relatedProducts
        return {
          product: response.product,
          relatedProducts: response.relatedProducts || []
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }]
    })
  })
});

export const {
  useFetchProductsQuery,
  useFetchFeaturedProductsQuery,
  useViewProductQuery
} = userProductApiSlice;