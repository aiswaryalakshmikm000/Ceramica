
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { selectUser } from "../../../features/userAuth/userAuthSlice";
// import { useGetAddressesQuery } from "../../../features/userAuth/userAddressApiSlice";
// import { useGetCartQuery } from "../../../features/userAuth/userCartApislice";
// import {
//   usePlaceCODOrderMutation,
//   usePlaceWalletOrderMutation,
//   useCreateRazorpayOrderMutation,
//   useVerifyRazorpayPaymentMutation,
// } from "../../../features/userAuth/userOrderApiSlice";
// import { toast } from "react-toastify";
// import AddressStep from "./AddressStep";
// import PaymentStep from "./PaymentStep";
// import ReviewStep from "./ReviewStep";
// import CheckoutBreadcrumbs from "./CheckoutBreadcrumbs";
// import OrderSummary from "./OrderSummary";
// import { useRazorpay } from "react-razorpay";


// const Checkout = () => {
//   const user = useSelector(selectUser);
//   const userId = user?.id;
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { Razorpay } = useRazorpay();

//   const steps = ["Address", "Payment", "Review"];
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   const [appliedCoupon, setAppliedCoupon] = useState(null);

//   const { data: cart, isLoading: isCartLoading, error: cartError } = useGetCartQuery(userId, {
//     skip: !userId,
//   });
//   const { data: addresses, isLoading: addressesLoading } = useGetAddressesQuery(userId, {
//     skip: !userId,
//   });
//   const [placeCODOrder, { isLoading: isPlacingCODOrder }] = usePlaceCODOrderMutation();
//   const [placeWalletOrder, { isLoading: isPlacingWalletOrder }] = usePlaceWalletOrderMutation();
//   const [createRazorpayOrder, { isLoading: isCreatingRazorpayOrder }] = useCreateRazorpayOrderMutation();
//   const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

//   useEffect(() => {
//     if (addresses && addresses.length > 0) {
//       const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
//       if (defaultAddress) {
//         setSelectedAddress({
//           ...defaultAddress,
//           fullName: defaultAddress.fullname || defaultAddress.fullName || "Customer",
//           phone: defaultAddress.phone || "9999999999",
//           email: defaultAddress.email || "customer@example.com",
//           addressLine: defaultAddress.addressLine || "",
//           city: defaultAddress.city || "",
//           state: defaultAddress.state || "",
//           pincode: defaultAddress.pincode || "",
//           landmark: defaultAddress.landmark || "",
//           addressType: defaultAddress.addressType || "Home",
//         });
//       }
//     }
//   }, [addresses]);

//   useEffect(() => {
//     if (!userId) {
//       toast.error("Please login to continue checkout");
//       navigate("/login", { state: { from: location.pathname } });
//     }
//   }, [userId, navigate, location.pathname]);

//   const handleNextStep = () => {
//     if (activeStep === 0 && !selectedAddress) {
//       toast.error("Please select an address to continue");
//       return;
//     }
//     if (activeStep === 1 && !selectedPaymentMethod) {
//       toast.error("Please select a payment method to continue");
//       return;
//     }
//     if (activeStep < steps.length - 1) {
//       setActiveStep(activeStep + 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handlePreviousStep = () => {
//     if (activeStep > 0) {
//       setActiveStep(activeStep - 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!cart || !selectedAddress || !selectedPaymentMethod) {
//       toast.error("Cart, address, or payment method missing");
//       return;
//     }

//     const orderData = {
//       cart: {
//         items: cart.items.map((item) => ({
//           productId: item.productId._id || item.productId,
//           name: item.productId.name,
//           color: item.color,
//           image: item.image,
//           quantity: item.quantity,
//           originalPrice: item.productId.price,
//           latestPrice: item.productId.discountedPrice,
//           discount: item.productId.discount,
//           totalPrice: item.productId.discountedPrice * item.quantity,
//         })),
//         totalMRP: cart.totalMRP,
//         totalDiscount: cart.totalDiscount,
//         deliveryCharge: cart.deliveryCharge || 0,
//         totalAmount: cart.totalAmount,
//         totalItems: cart.totalItems,
//       },
//       address: {
//         fullName: selectedAddress.fullName,
//         phone: selectedAddress.phone,
//         email: selectedAddress.email,
//         addressLine: selectedAddress.addressLine,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         pincode: selectedAddress.pincode,
//         landmark: selectedAddress.landmark,
//         addressType: selectedAddress.addressType,
//       },
//       coupon: appliedCoupon,
//       userId,
//     };

//     try {
//       if (selectedPaymentMethod === "Razorpay") {
//         const razorpayOrder = await createRazorpayOrder({
//           amount: orderData.cart.totalAmount,
//           userId,
//           items: orderData.cart.items,
//           shippingAddress: orderData.address,
//           coupon: orderData.coupon,
//         }).unwrap();

//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//           amount: razorpayOrder.data.amount,
//           currency: razorpayOrder.data.currency,
//           name: "CERAMICA",
//           description: "Order Payment",
//           order_id: razorpayOrder.data.orderId,
//           handler: async (response) => {
//             try {
//               const verification = await verifyRazorpayPayment({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               }).unwrap();
//               toast.success(verification.message || "Razorpay order placed successfully!");
//               navigate(`/order-confirmation/${verification.data.orderNumber}`);
//             } catch (error) {
//               toast.error(error?.data?.message || "Payment verification failed");
//             navigate(`/order-failure/${razorpayOrder.data.orderNumber}`);
//             }
//           },
//           prefill: {
//             name: selectedAddress.fullName,
//             email: selectedAddress.email,
//             contact: selectedAddress.phone,
//           },
//           theme: {
//             color: "#F37254",
//           },
//         };

//         const razorpayInstance = new Razorpay(options);
//         razorpayInstance.on("payment.failed", (response) => {
//           toast.error(`Payment failed: ${response.error.description}`);
//           navigate(`/order-failure/${razorpayOrder.data.orderNumber}`);
//         });
//         razorpayInstance.open();
//       } else if (selectedPaymentMethod === "Cash on Delivery") {
//         const result = await placeCODOrder(orderData).unwrap();
//         toast.success(result.message || "COD order placed successfully!");
//         navigate(`/order-confirmation/${result.data.orderNumber}`);
//       } else if (selectedPaymentMethod === "Wallet") {
//         const result = await placeWalletOrder(orderData).unwrap();
//         toast.success(result.message || "Wallet order placed successfully!");
//         navigate(`/order-confirmation/${result.data.orderNumber}`);
//       }
//     } catch (error) {

//       toast.error(error?.data?.message || "Failed to place order");
//       // navigate(`/order-failure/unknown`);
//     }
//   };

//   if (!userId) return null;
//   if (isCartLoading || addressesLoading)
//     return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
//   if (cartError)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Error: {cartError?.data?.message || cartError.message}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50/50 py-20 my-5 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto mb-8">
//         <CheckoutBreadcrumbs steps={steps} activeStep={activeStep} />
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3 space-y-6">
//             {activeStep === 0 && (
//               <AddressStep
//                 addresses={addresses || []}
//                 selectedAddress={selectedAddress}
//                 setSelectedAddress={setSelectedAddress}
//                 onNext={handleNextStep}
//               />
//             )}

//             {activeStep === 1 && (
//               <PaymentStep
//                 onNext={handleNextStep}
//                 onBack={handlePreviousStep}
//                 selectedPaymentMethod={selectedPaymentMethod}
//                 setSelectedPaymentMethod={setSelectedPaymentMethod}
//                 cart={cart}
//                 selectedAddress={selectedAddress}
//               />
//             )}

//             {activeStep === 2 && (
//               <ReviewStep
//                 cart={cart}
//                 address={selectedAddress}
//                 paymentMethod={selectedPaymentMethod}
//                 coupon={appliedCoupon}
//                 onBack={handlePreviousStep}
//                 onPlaceOrder={handlePlaceOrder}
//                 isPlacingOrder={
//                   isPlacingCODOrder || isPlacingWalletOrder || isCreatingRazorpayOrder
//                 }
//               />
//             )}
//           </div>

//           <div className="lg:w-1/3">
//             <OrderSummary
//               cart={cart}
//               activeStep={activeStep}
//               onNext={handleNextStep}
//               onBack={handlePreviousStep}
//               appliedCoupon={appliedCoupon}
//               setAppliedCoupon={setAppliedCoupon}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;



// src/components/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useGetAddressesQuery } from "../../../features/userAuth/userAddressApiSlice";
import { useGetCartQuery } from "../../../features/userAuth/userCartApislice";
import {
  usePlaceCODOrderMutation,
  usePlaceWalletOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useRetryRazorpayPaymentMutation,
} from "../../../features/userAuth/userOrderApiSlice";
import { toast } from "react-toastify";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import CheckoutBreadcrumbs from "./CheckoutBreadcrumbs";
import OrderSummary from "./OrderSummary";
import PaymentFailureModal from "./PaymentFailureModal"; 
import { useRazorpay } from "react-razorpay";
import { handleRetryPayment } from "../../../services/retryRazorpayUtils";

const Checkout = () => {
  const user = useSelector(selectUser);
  const userId = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const { Razorpay } = useRazorpay();

  const steps = ["Address", "Payment", "Review"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false); 
  const [failedOrderId, setFailedOrderId] = useState(null); 
  
  const { data: cart, isLoading: isCartLoading, error: cartError } = useGetCartQuery(userId, {
    skip: !userId,
  });
  const { data: addresses, isLoading: addressesLoading } = useGetAddressesQuery(userId, {
    skip: !userId,
  });
  const [placeCODOrder, { isLoading: isPlacingCODOrder }] = usePlaceCODOrderMutation();
  const [placeWalletOrder, { isLoading: isPlacingWalletOrder }] = usePlaceWalletOrderMutation();
  const [createRazorpayOrder, { isLoading: isCreatingRazorpayOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [retryRazorpayPayment, { isLoading: isRetryingPayment }] = useRetryRazorpayPaymentMutation();

  useEffect(() => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userId, navigate, location.pathname]);

  const handleNextStep = () => {
    if (activeStep === 0 && !selectedAddress) {
      toast.error("Please select an address to continue");
      return;
    }
    if (activeStep === 1 && !selectedPaymentMethod) {
      toast.error("Please select a payment method to continue");
      return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCloseModal = () => {
    setIsFailureModalOpen(false);
    setFailedOrderId(null);
  };

  const handleViewOrderDetails = () => {
    if (failedOrderId) {
      navigate(`/orders/${failedOrderId}`);
      handleCloseModal();
    }
  };

  const handleRetryPaymentModal = () => {
    if (failedOrderId) {
      handleRetryPayment(
        { orderNumber: failedOrderId }, 
        userId,
        Razorpay,
        verifyRazorpayPayment,
        retryRazorpayPayment,
        navigate
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || !selectedAddress || !selectedPaymentMethod) {
      toast.error("Cart, address, or payment method missing");
      return;
    }

    const orderData = {
      cart: {
        items: cart.items.map((item) => ({
          productId: item.productId._id || item.productId,
          name: item.productId.name,
          color: item.color,
          image: item.image,
          quantity: item.quantity,
          originalPrice: item.productId.price,
          latestPrice: item.productId.discountedPrice,
          discount: item.productId.discount,
          totalPrice: item.productId.discountedPrice * item.quantity,
        })),
        totalMRP: cart.totalMRP,
        totalDiscount: cart.totalDiscount,
        deliveryCharge: cart.deliveryCharge || 0,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      },
      address: {
        fullName: selectedAddress.fullname,
        phone: selectedAddress.phone,
        email: selectedAddress.email,
        addressLine: selectedAddress.addressLine,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        landmark: selectedAddress.landmark,
        addressType: selectedAddress.addressType,
      },
      coupon: appliedCoupon,
      userId,
    };

    try {
      if (selectedPaymentMethod === "Razorpay") {
        const razorpayOrder = await createRazorpayOrder({
          amount: orderData.cart.totalAmount,
          userId,
          items: orderData.cart.items,
          shippingAddress: orderData.address,
          coupon: orderData.coupon,
        }).unwrap();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.data.amount,
          currency: razorpayOrder.data.currency,
          name: "CERAMICA",
          description: "Order Payment",
          order_id: razorpayOrder.data.orderId,
          handler: async (response) => {
            try {
              const verification = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
              toast.success(verification.message || "Razorpay order placed successfully!");
              navigate(`/order-confirmation/${verification.data.orderNumber}`);
            } catch (error) {
              toast.error(error?.data?.message || "Payment verification failed");
              setFailedOrderId(razorpayOrder.data.orderNumber); // Set failed order ID
              setIsFailureModalOpen(true); // Open modal
            }
          },
          prefill: {
            name: selectedAddress.fullName,
            email: selectedAddress.email,
            contact: selectedAddress.phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.on("payment.failed", (response) => {
          toast.error(`Payment failed: ${response.error.description}`);
          setFailedOrderId(razorpayOrder.data.orderNumber); // Set failed order ID
          setIsFailureModalOpen(true); // Open modal
        });
        razorpayInstance.open();
      } else if (selectedPaymentMethod === "Cash on Delivery") {
        const result = await placeCODOrder(orderData).unwrap();
        toast.success(result.message || "COD order placed successfully!");
        navigate(`/order-confirmation/${result.data.orderNumber}`);
      } else if (selectedPaymentMethod === "Wallet") {
        const result = await placeWalletOrder(orderData).unwrap();
        toast.success(result.message || "Wallet order placed successfully!");
        navigate(`/order-confirmation/${result.data.orderNumber}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  if (!userId) return null;
  if (isCartLoading || addressesLoading)
    return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  if (cartError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {cartError?.data?.message || cartError.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 my-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8">
        <CheckoutBreadcrumbs steps={steps} activeStep={activeStep} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            {activeStep === 0 && (
              <AddressStep
                addresses={addresses || []}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                onNext={handleNextStep}
              />
            )}

            {activeStep === 1 && (
              <PaymentStep
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                cart={cart}
                selectedAddress={selectedAddress}
              />
            )}

            {activeStep === 2 && (
              <ReviewStep
                cart={cart}
                address={selectedAddress}
                paymentMethod={selectedPaymentMethod}
                coupon={appliedCoupon}
                onBack={handlePreviousStep}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={
                  isPlacingCODOrder || isPlacingWalletOrder || isCreatingRazorpayOrder
                }
              />
            )}
          </div>

          <div className="lg:w-1/3">
            <OrderSummary
              cart={cart}
              activeStep={activeStep}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
            />
          </div>
        </div>
      </div>

      {/* Render the Payment Failure Modal */}
      <PaymentFailureModal
        isOpen={isFailureModalOpen}
        onClose={handleCloseModal}
        orderId={failedOrderId}
        onRetryPayment={handleRetryPaymentModal}
        onViewOrderDetails={handleViewOrderDetails}
        isRetryingPayment={isRetryingPayment}
      />
    </div>
  );
};

export default Checkout;