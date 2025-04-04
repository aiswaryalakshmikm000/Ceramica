// import { userApi } from "../../services/api/userApi";

// export const userApiSlice = userApi.injectEndpoints({
//   endpoints: (builder) => ({

//     checkAuth: builder.query({
//       query: () => '/check-auth',
//       transformResponse: (response) => response.user,
//     }),

//     register: builder.mutation({
//       query: (credentials) => ({
//         url: "/register",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/login",
//         method: "POST",
//         body: credentials,
//       }),
//       invalidatesTags: ["User, Wishlist, Cart"],
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: "/logout",
//         method: "POST",
//       }),
//     }),
    
//     sendOTP: builder.mutation({
//       query: (data) => ({
//         url: "/send-otp",
//         method: "POST",
//         body: data,
//       }),
//     }),
//     verifyOTP: builder.mutation({
//       query: (data) => ({
//         url: "/verify-otp",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     forgetPassword: builder.mutation({
//       query: (data) => ({
//         url: "/forget-password",
//         method: "POST",
//         body: data, // { email }
//       }),
//     }),
//     resendOTP: builder.mutation({
//       query: (data) => ({
//         url: "/resend-otp",
//         method: "POST",
//         body: data, // { email }
//       }),
//     }),
//     verifyResetOTP: builder.mutation({
//       query: (data) => ({
//         url: "/reset/verify-otp",
//         method: "POST",
//         body: data, // { email, otp }
//       }),
//     }),
  
//     resetPassword: builder.mutation({
//       query: (data) => ({
//         url: "/reset-password",
//         method: "POST",
//         body: data, // { email, password }
//       }),
//     }),

//     googleAuth: builder.mutation({
//       query: (credentials) => ({
//         url: "/google-auth",
//         method: "POST",
//         body: credentials, // { credential: "google-jwt-token" }
//       }),
//       invalidatesTags: ["User", "Wishlist", "Cart"],
//     }),
    
//     showProfile: builder.query({
//       query: (id) => `/profile/${id}`,
//       transformResponse: (response) => response.user,
//       providesTags: ["User"],
//     }),
//     updateProfile: builder.mutation({
//       query: ({ id, formData }) => ({
//         url: `/profile/${id}`,
//         method: "PUT",
//         body: formData,
//       }),
//       invalidatesTags: ["User"], 
//     }),

//     getAddresses: builder.query({
//       query: (userId) => `/addresses/${userId}`,
//       providesTags: ["Address"],
//       transformResponse: (response) => response.addresses,
//     }),

//     addAddress: builder.mutation({
//       query: ({ userId, addressData }) => ({
//         url: `/addresses/${userId}`,
//         method: "POST",
//         body: addressData,
//       }),
//       invalidatesTags: ["Address"],
//     }),

//     updateAddress: builder.mutation({
//       query: ({ addressId, userId, addressData }) => ({
//         url: `/address/${userId}/${addressId}`,
//         method: "PUT",
//         body: addressData,
//       }),
//       invalidatesTags: ["Address"],
//     }),
//     deleteAddress: builder.mutation({
//       query: ({ userId, addressId }) => ({
//         url: `/address/${userId}/${addressId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Address"],
//     }),

//     setDefaultAddress: builder.mutation({
//       query: ({ addressId }) => ({
//         url: `/address/${addressId}/set-default`,
//         method: "PUT",
//       }),
//       invalidatesTags: ["Address"],
//     }),
//   }),
// });


// export const {
//   useRegisterMutation,
//   useLoginMutation,
//   useLogoutMutation,
//   useSendOTPMutation,
//   useVerifyOTPMutation,
//   useForgetPasswordMutation, 
//   useVerifyResetOTPMutation, 
//   useResendOTPMutation,      
//   useResetPasswordMutation,
//   useGoogleAuthMutation,  
//   useCheckAuthQuery,
//   useShowProfileQuery,
//   useUpdateProfileMutation,
//   useGetAddressesQuery,
//   useAddAddressMutation,
//   useUpdateAddressMutation,
//   useDeleteAddressMutation,
//   useSetDefaultAddressMutation,
 
// } = userApiSlice;




import { userApi } from "../../services/api/userApi";

export const userApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    checkAuth: builder.query({
      query: () => '/check-auth',
      transformResponse: (response) => response.user,
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User, Wishlist, Cart"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    
    sendOTP: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    verifyResetOTP: builder.mutation({
      query: (data) => ({
        url: "/reset/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
  
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    googleAuth: builder.mutation({
      query: (credentials) => ({
        url: "/google-auth",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Wishlist", "Cart"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useForgetPasswordMutation,
  useVerifyResetOTPMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useCheckAuthQuery,
} = userApiSlice;