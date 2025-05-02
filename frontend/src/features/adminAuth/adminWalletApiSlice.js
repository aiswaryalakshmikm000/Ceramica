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
      query: ({ page = 1, limit = 10, search = "", type = "", date = "" }) => ({
        url: `/wallet/transactions?page=${page}&limit=${limit}&search=${search}&type=${type}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["Transactions"],
    }),
  }),
});

export const { 
    useGetAdminWalletQuery, 
    useGetWalletTransactionsQuery 
} = adminWalletApiSlice;