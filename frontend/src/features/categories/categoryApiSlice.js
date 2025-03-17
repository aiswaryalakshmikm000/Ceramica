// src/features/categories/categoryApiSlice.js
import { adminApi } from '../../services/api/adminApi';

export const categoryApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET'
      }),
      providesTags: ['Category'],
    }),
    getCategory: builder.query({
      query: (catId) => ({
        url: `/categories/${catId}`,
        method: 'GET'
      }),
      providesTags: (result, error, catId) => [{ type: 'Category', id: catId }],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ catId, ...category }) => ({
        url: `/categories/${catId}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    listCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/list/${categoryId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Category'], // Changed to invalidate the generic 'Category' tag
    }),
    deleteCategory: builder.mutation({
      query: (catId) => ({
        url: `/categories/${catId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useListCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;