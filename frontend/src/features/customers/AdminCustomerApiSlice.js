import { adminApi } from "../../services/api/adminApi"; // Import the existing adminApi

export const adminCustomerApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getCustomerDetails: builder.query({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params, 
      }),
      providesTags: ["Customer"],
    }),

    editCustomerStatus: builder.mutation({
      query: (userId) => ({
        url: `/customers/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"], 
    }),
  }),
});

export const {
  useGetCustomerDetailsQuery,
  useEditCustomerStatusMutation,
} = adminCustomerApiSlice;