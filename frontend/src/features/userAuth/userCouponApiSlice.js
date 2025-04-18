import { userApi } from "../../services/api/userApi";

export const userCouponApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCoupons: builder.query({
      query: () => ({
        url: "/coupons",
        method: "GET",
      }),
      providesTags: ["UserCoupon"],
    }),
    applyCoupon: builder.mutation({
      query: (code) => ({
        url: "/coupons/apply",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["UserCoupon", "Cart"],
    }),
  }),
});

export const {
  useGetUserCouponsQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = userCouponApiSlice;