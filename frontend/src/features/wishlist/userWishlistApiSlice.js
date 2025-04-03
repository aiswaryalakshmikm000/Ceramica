import { userApi } from "../../services/api/userApi";

export const userWishlistApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
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
  })
});

export const {
  useFetchWishlistQuery,
  useToggleWishlistItemMutation,
  useRemoveFromWishlistMutation,
  useUpdateWishlistItemMutation,
} = userWishlistApiSlice;