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
      query: (userId) => `/wishlist/${userId}`,
      providesTags: ["Wishlist"],
      transformResponse: (response) => response || [],
    }),
    
    toggleWishlistItem: builder.mutation({
      query: ({ userId, productId, color }) => ({
        url: `/wishlist/${userId}/toggle`,
        method: "POST",
        body: { productId, color },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: ({ userId, productId, color }) => ({
        url: `/wishlist/${userId}/remove`,
        method: "DELETE",
        body: { productId, color },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    updateWishlistItem: builder.mutation({
      query: ({ userId, productId, oldColor, newColor }) => ({
        url: `/wishlist/${userId}/update`,
        method: "PUT",
        body: { productId, oldColor, newColor },
      }),
      invalidatesTags: ["Wishlist"],
    }),


    addToCart: builder.mutation({
      query: ({ userId, productId, quantity, color }) => ({
        url: `/cart/${userId}/add`,
        method: "POST",
        body: { productId, quantity, color },
      }),
      invalidatesTags: ["Cart", "Wishlist"],
    }),

    getCart: builder.query({
      query: (userId) => `/cart/${userId}`,
      providesTags: ["Cart"],
      transformResponse: (response) => response.cart,
    }),

    updateCartItem: builder.mutation({
      query: ({ userId, productId, quantity, color }) => ({
        url: `/cart/${userId}/update`,
        method: "PUT",
        body: { productId, quantity, color },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: ({ userId, productId, color }) => ({
        url: `/cart/${userId}/remove`,
        method: "DELETE",
        body: { productId, color },
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
  useToggleWishlistItemMutation,
  useRemoveFromWishlistMutation,
  useUpdateWishlistItemMutation,
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,

} = userProductApiSlice;