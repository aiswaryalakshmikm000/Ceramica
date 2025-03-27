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
        // Transform response to extract product and relatedProducts
        return {
          product: response.product,
          relatedProducts: response.relatedProducts || []
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }]
    }),

    fetchWishlist: builder.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),


    fetchCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity, color }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity, color },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

  })
});

export const {
  useFetchProductsQuery,
  useFetchFeaturedProductsQuery,
  useViewProductQuery,
  useFetchWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useFetchCartMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,

} = userProductApiSlice;