// src/features/categories/categoryApiSlice.js
import { baseApi } from '../../services/api/userApi';

export const categoryApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    // Admin endpoints
    addCategory: builder.mutation({
      query: (category) => ({
        url: '/admin/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
