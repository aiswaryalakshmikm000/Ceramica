import { adminApi } from '../../services/api/adminApi';

export const AdminCategoryApiSlice = adminApi.injectEndpoints({
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
      query: (formData) => ({
        url: '/categories',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation({
      query: ({ catId, formData }) => ({
        url: `/categories/${catId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),
    listCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/list/${categoryId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Category'],
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
} = AdminCategoryApiSlice;