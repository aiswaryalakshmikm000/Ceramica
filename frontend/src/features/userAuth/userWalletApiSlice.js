import { userApi } from '../../services/api/userApi';

export const userWalletApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
   
    getWallet: builder.query({
      query: ({ page, limit, type }) => ({
        url: `/wallet?page=${page}&limit=${limit}&type=${type}`,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    
    addFunds: builder.mutation({
      query: (amount) => ({
        url: '/wallet/add',
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: ['Wallet'],
    }),
  }),
});

export const { 
    useGetWalletQuery, 
    useAddFundsMutation 
} = userWalletApiSlice;