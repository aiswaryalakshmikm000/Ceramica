import { userApi } from '../../services/api/userApi';

export const UserCategoryApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    showCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET'
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useShowCategoriesQuery,
} = UserCategoryApiSlice;