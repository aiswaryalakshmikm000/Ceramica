import { adminApi } from "../../services/api/adminApi";

export const adminSalesReportApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ period, startDate, endDate }) => ({
        url: "/sales-report",
        method: "GET",
        params: {
          period,
          startDate: startDate,
          endDate: endDate,
        },
      }),
      providesTags: ["SalesReport"],
    }),
    downloadExcelReport: builder.mutation({
      query: ({ period, startDate, endDate }) => ({
        url: "/sales-report/download/excel",
        method: "GET",
        params: {
          period,
          startDate: startDate,
          endDate: endDate,
        },
        responseHandler: (response) => response.blob(), // Handle binary response
      }),
    }),
    downloadPdfReport: builder.mutation({
      query: ({ period, startDate, endDate }) => ({
        url: "/sales-report/download/pdf",
        method: "GET",
        params: {
          period,
          startDate: startDate,
          endDate: endDate,
        },
        responseHandler: (response) => response.blob(), // Handle binary response
      }),
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useDownloadExcelReportMutation,
  useDownloadPdfReportMutation,
} = adminSalesReportApiSlice;