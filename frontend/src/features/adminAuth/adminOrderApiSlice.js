
import { adminApi } from "../../services/api/adminApi";

export const adminOrderApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params, // { page, limit, search, sort, status }
      }),
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map(({ orderNumber }) => ({ type: "Order", id: orderNumber })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),

    verifyReturnRequest: builder.mutation({
      query: ({ orderId, isApproved }) => ({
        url: `/orders/${orderId}/return`,
        method: "PUT",
        body: { isApproved },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
        "Product", 
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useVerifyReturnRequestMutation,
} = adminOrderApiSlice;