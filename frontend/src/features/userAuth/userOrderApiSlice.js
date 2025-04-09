
import { userApi } from '../../services/api/userApi';

export const userOrderApiSlice = userApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    getUserOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: ({ orderId, cancelReason }) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'PUT',
        body: { cancelReason },
      }),
      invalidatesTags: ['Order', 'Product'],
    }),
    cancelOrderItem: builder.mutation({
      query: ({ orderId, itemId, cancelProductReason }) => ({
        url: '/orders/cancel-item',
        method: 'POST',
        body: { orderId, itemId, cancelProductReason },
      }),
    }),
    requestReturn: builder.mutation({
      query: ({ orderId, reason, comment }) => ({
        url: `/orders/${orderId}/return`,
        method: 'PUT',
        body: { reason, comment },
      }),
      invalidatesTags: ['Order'],
    }),
    requestReturnItem: builder.mutation({ 
      query: ({ orderId, itemId, reason }) => ({
        url: '/orders/return-item',
        method: 'POST',
        body: { orderId, itemId, reason },
      }),
    }),
    downloadInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/invoice`,
        method: 'GET', 
        responseHandler: (response) => response.blob(), 
      }),
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCancelOrderItemMutation,
  useRequestReturnMutation,
  useRequestReturnItemMutation,
  useDownloadInvoiceMutation,
} = userOrderApiSlice;