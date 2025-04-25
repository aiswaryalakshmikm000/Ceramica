
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { toast } from "react-toastify";
import { useRazorpay } from "react-razorpay";
import {
  useGetOrderByIdQuery,
  useRetryRazorpayPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} from "../../../features/userAuth/userOrderApiSlice";
import { handleRetryPayment } from "../../../services/retryRazorpayUtils";

const OrderFailure = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const { Razorpay } = useRazorpay();

  const { data: orderResponse, isLoading: isOrderLoading, error: orderError } = useGetOrderByIdQuery(
    orderId,
    { skip: !userId || !orderId }
  );
  const order = orderResponse?.data;
  const [RetryRazorpayPayment, { isLoading: isRetryingPayment }] = useRetryRazorpayPaymentMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  const handleViewOrderDetails = () => {
    navigate(`/orders/${orderId}`);
  };

  if (!userId) return null;
  if (isOrderLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (orderError || order.paymentStatus==="Paid") return <div className="min-h-screen flex items-center justify-center">Error loading order</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment for order #{orderId}. Please try again or check your order details.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() =>
              handleRetryPayment(
                order,
                userId,
                Razorpay,
                verifyRazorpayPayment,
                RetryRazorpayPayment,
                navigate
              )
            }
            className={`px-6 py-2 rounded-lg text-white ${
              isRetryingPayment || isOrderLoading
                ? "bg-orange-600/70 cursor-not-allowed"
                : "bg-orange-800 hover:bg-orange-900"
            } transition-colors`}
            disabled={isRetryingPayment || isOrderLoading}
          >
            {isRetryingPayment ? "Processing..." : "Retry Payment"}
          </button>
          <button
            onClick={handleViewOrderDetails}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailure;