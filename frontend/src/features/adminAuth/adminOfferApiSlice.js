import { adminApi } from "../../services/api/adminApi";

export const adminOfferApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: (params) => ({
        url: "/offers",
        params,
      }),
      providesTags: ["Offers"],
    }),
    statusToggle: builder.mutation({
      query: (offerId) => ({
        url: `/offers/${offerId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Offers"],
    }),
    addOffer: builder.mutation({
      query: (offerData) => ({
        url: "/offers/add",
        method: "POST",
        body: offerData,
      }),
      invalidatesTags: ["Offers"],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useStatusToggleMutation,
  useAddOfferMutation,
} = adminOfferApiSlice;