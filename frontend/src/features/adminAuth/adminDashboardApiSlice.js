import { adminApi } from "../../services/api/adminApi";

export const adminDashboardApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard summary stats
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/status",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    // Get sales data with filters
    getSalesData: builder.query({
      query: ({ startDate, endDate, filterType }) => ({
        url: "/dashboard/sales",
        method: "GET",
        params: { startDate, endDate, filterType },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get top products
    getTopProducts: builder.query({
      query: ({ startDate, endDate, limit = 10,filterType }) => ({
        url: "/dashboard/top-products",
        method: "GET",
        params: { startDate, endDate, limit, filterType },
      }),
      providesTags: ["Dashboard", "Product"],
    }),

    // Get top categories
    getTopCategories: builder.query({
      query: ({ startDate, endDate, limit = 10, filterType }) => ({
        url: "/dashboard/top-categories",
        method: "GET",
        params: { startDate, endDate, limit, filterType },
      }),
      providesTags: ["Dashboard", "Category"],
    }),

  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetSalesDataQuery,
  useGetTopProductsQuery,
  useGetTopCategoriesQuery,
} = adminDashboardApiSlice
