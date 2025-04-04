import { adminApi } from "../../services/api/adminApi";

export const adminApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({

    checkAuth: builder.query({
      query: () => '/check-auth',
      transformResponse: (response) => response.admin,
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

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useCheckAuthQuery } = adminApiSlice;
