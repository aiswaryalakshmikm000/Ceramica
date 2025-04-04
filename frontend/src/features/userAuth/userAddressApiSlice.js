import { userApi } from "../../services/api/userApi";

export const userAddressApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: (userId) => `/addresses/${userId}`,
      providesTags: ["Address"],
      transformResponse: (response) => response.addresses,
    }),
    addAddress: builder.mutation({
      query: ({ userId, addressData }) => ({
        url: `/addresses/${userId}`,
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, userId, addressData }) => ({
        url: `/address/${userId}/${addressId}`,
        method: "PUT",
        body: addressData,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: ({ userId, addressId }) => ({
        url: `/address/${userId}/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `/address/${addressId}/set-default`,
        method: "PUT",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = userAddressApiSlice;