import { toast } from "react-toastify";

export const handleRetryPayment = async (
  order,
  userId,
  Razorpay,
  verifyRazorpayPayment,
  retryRazorpayPayment,
  navigate,
  onFailure 
) => {
  try {
    const razorpayOrder = await retryRazorpayPayment({
      orderNumber: order.orderNumber,
      userId,
    }).unwrap();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.data.amount,
      currency: razorpayOrder.data.currency,
      name: "CERAMICA",
      description: "Retry Order Payment",
      order_id: razorpayOrder.data.orderId,
      handler: async (response) => {
        try {
          const verification = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();
          toast.success(verification.message || "Payment successful!");
          navigate(`/order-confirmation/${verification.data.orderNumber}`);
        } catch (error) {
          toast.error(error?.data?.message || "Payment verification failed");
          if (onFailure) {
            onFailure(razorpayOrder.data.orderNumber); 
          } else {
            navigate(`/order-failure/${razorpayOrder.data.orderNumber}`);
          }
        }
      },
      prefill: {
        name: order.shippingAddress?.fullName || "Customer",
        email: order.shippingAddress?.email || "customer@example.com",
        contact: order.shippingAddress?.phone || "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.on("payment.failed", (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
      if (onFailure) {
        onFailure(razorpayOrder.data.orderNumber); // Call onFailure with orderNumber
      } else {
        navigate(`/order-failure/${razorpayOrder.data.orderNumber}`);
      }
    });
    razorpayInstance.open();
  } catch (error) {
    toast.error(error?.data?.message || "Failed to initiate retry payment");
    if (onFailure) {
      onFailure(order.orderNumber); // Call onFailure with orderNumber
    } else {
      navigate(`/order-failure/${order.orderNumber}`);
    }
  }
};