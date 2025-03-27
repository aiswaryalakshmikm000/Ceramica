import { adminApi } from "../../services/api/adminApi";
import { setAdminCredentials, logoutAdmin } from "../../features/auth/adminAuthSlice";

export const adminApiSlice = adminApi.injectEndpoints({
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
      invalidatesTags: ["User", "Order"],
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = adminApiSlice;
