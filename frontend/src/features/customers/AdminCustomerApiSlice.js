import { adminApi } from "../../services/api/adminApi"; // Import the existing adminApi

export const adminCustomerApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all customers (with pagination and search)
    getCustomerDetails: builder.query({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params, // { page, limit, term }
      }),
      providesTags: ["Customer"],
    }),

    // Edit customer status (block/unblock)
    editCustomerStatus: builder.mutation({
      query: (userId) => ({
        url: `/customers/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"], // Invalidate all customer data after status change
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCustomerDetailsQuery,
  useEditCustomerStatusMutation,
} = adminCustomerApiSlice;