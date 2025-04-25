import { userApi } from "../../services/api/userApi";

export const userReferAndEarnApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getReferralInfo: builder.query({
        query: (userId) => `/${userId}/referral`,
        transformResponse: (response) => response.data,
        providesTags: ["Referral"],
      }),

      applyReferralCode: builder.mutation({
        query: ({ userId, referralCode }) => ({
          url: `/referrals/apply`,
          method: "POST",
          body: { userId, referralCode },
        }),
        invalidatesTags: ["Referral"],
      }),

  })
});

export const {
    useGetReferralInfoQuery, 
    useApplyReferralCodeMutation
} = userReferAndEarnApiSlice;