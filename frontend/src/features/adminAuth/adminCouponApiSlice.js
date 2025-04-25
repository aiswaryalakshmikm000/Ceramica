
import { adminApi } from "../../services/api/adminApi";

export const adminCouponApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getCoupons: builder.query({
        query: ({ search, status, page, limit }) => ({
          url: "/coupons",
          method: "GET",
          params: { search, status, page, limit },
        }),
        providesTags: ["Coupon"],
      }),

    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: "/coupons/add-coupon",
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["Coupon"],
    }),

    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/coupons/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} = adminCouponApiSlice;