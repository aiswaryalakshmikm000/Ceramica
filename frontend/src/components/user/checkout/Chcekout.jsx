import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useGetAddressesQuery } from "../../../features/userAuth/userAddressApiSlice";
import { useGetCartQuery } from "../../../features/userAuth/userCartApislice";
import { usePlaceOrderMutation } from "../../../features/userAuth/userOrderApiSlice";
import { toast } from "react-toastify";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import CheckoutBreadcrumbs from "./CheckoutBreadcrumbs";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const user = useSelector(selectUser);
  const userId = user?._id;
  const navigate = useNavigate();
  const location = useLocation();

  const steps = ["Address", "Payment", "Review"];
  const [activeStep, setActiveStep] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const { data: cart, isLoading: isCartLoading, error: cartError } = useGetCartQuery(userId, { skip: !userId });
  const { data: addresses, isLoading: addressesLoading } = useGetAddressesQuery(userId, { skip: !userId });
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  useEffect(() => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userId, navigate, location.pathname]);

  // useEffect(() => {
  //   if (cart && cart.items && cart.items.length === 0) {
  //     toast.info("Your cart is empty");
  //     navigate("/shop");
  //   }
  // }, [cart, navigate]);

  if (!userId) return null;
  if (isCartLoading || addressesLoading) return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  if (cartError) return <div className="min-h-screen flex items-center justify-center">Error: {cartError?.data?.message || cartError.message}</div>;

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

  const applyCoupon = (coupon) => {
    setAppliedCoupon({
      code: coupon,
      discount: 50,
      discountType: "fixed"
    });
    toast.success(`Coupon ${coupon} applied successfully`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        cart: {
          items: cart.items.map(item => ({
            productId: item.productId._id || item.productId,
            name: item.name,
            color: item.color,
            image: item.image,
            quantity: item.quantity,
            originalPrice: item.originalPrice,
            latestPrice: item.latestPrice,
            discount: item.discount,
          })),
          totalMRP: cart.totalMRP,
          totalDiscount: cart.totalDiscount,
          deliveryCharge: cart.deliveryCharge || 0,
          totalAmount: cart.totalAmount,
          totalItems: cart.totalItems,
        },
        address: {
          fullName: selectedAddress.fullname || selectedAddress.fullName,
          phone: selectedAddress.phone,
          email: selectedAddress.email || "user@example.com",
          addressLine: selectedAddress.addressLine,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          landmark: selectedAddress.landmark || "",
          addressType: selectedAddress.addressType || "Home",
        },
        paymentMethod: selectedPaymentMethod,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discount: appliedCoupon.discount,
          discountType: appliedCoupon.discountType,
        } : null,
      };

      const result = await placeOrder(orderData).unwrap();
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { order: result.data } });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

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
              />
            )}
          </div>

          <div className="lg:w-1/3">
            <OrderSummary 
              cart={cart}
              coupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              activeStep={activeStep}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;