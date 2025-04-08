import { userApi } from "../../services/api/userApi";

export const userCartApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
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

    validateCheckout: builder.mutation({ // Changed to mutation
      query: () => ({
        url: '/checkout',
        method: 'GET',
      }),
      invalidatesTags: ['Cart'], // Optional: refresh cart if needed
    }),

  })
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useValidateCheckoutMutation,
} = userCartApiSlice;