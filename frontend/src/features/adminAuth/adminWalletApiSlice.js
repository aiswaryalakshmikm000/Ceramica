import { adminApi } from '../../services/api/adminApi';

export const adminWalletApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminWallet: builder.query({
      query: () => ({
        url: "/wallet",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getWalletTransactions: builder.query({
      query: (params) => ({
        url: "/wallet/transactions",
        method: "GET",
        params, 
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const { 
    useGetAdminWalletQuery, 
    useGetWalletTransactionsQuery 
} = adminWalletApiSlice;