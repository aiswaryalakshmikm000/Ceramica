import { userApi } from "../../services/api/userApi";

export const userApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
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
        body: data, // { email }
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/resend-otp",
        method: "POST",
        body: data, // { email }
      }),
    }),
    verifyResetOTP: builder.mutation({
      query: (data) => ({
        url: "/reset/verify-otp",
        method: "POST",
        body: data, // { email, otp }
      }),
    }),
  
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data, // { email, password }
      }),
    }),

    googleAuth: builder.mutation({
      query: (credentials) => ({
        url: "/google-auth",
        method: "POST",
        body: credentials, // { credential: "google-jwt-token" }
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
} = userApiSlice;
