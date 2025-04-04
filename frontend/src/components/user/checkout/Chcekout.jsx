
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectUser } from "../../../features/auth/userAuthSlice";
import { useGetAddressesQuery } from "../../../features/auth/userApiSlice";
import { useGetCartQuery } from "../../../features/products/userProductApislice";
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

  // Checkout steps
  const steps = ["Address", "Payment", "Review"];
  const [activeStep, setActiveStep] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Fetch cart data
  const {
    data: cart,
    isLoading: isCartLoading,
    error: cartError,
  } = useGetCartQuery(userId, { skip: !userId });

  // Fetch addresses
  const {
    data: addresses,
    isLoading: addressesLoading,
  } = useGetAddressesQuery(userId, { skip: !userId });

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  // Check if user is logged in
  useEffect(() => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userId, navigate, location.pathname]);

  // Check if cart is empty
  useEffect(() => {
    if (cart && cart.items && cart.items.length === 0) {
      toast.info("Your cart is empty");
      navigate("/shop");
    }
  }, [cart, navigate]);

  if (!userId) return null;
  if (isCartLoading || addressesLoading) return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  if (cartError) {
    return <div className="min-h-screen flex items-center justify-center">Error loading checkout: {cartError?.data?.message || cartError.message}</div>;
  }

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
    // In a real app, you would validate the coupon code with your API
    // For now, we'll just apply a mock discount
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

  const placeOrder = () => {
    // In a real implementation, you would call your API to create the order
    toast.success("Your order has been placed successfully!");
    navigate("/order-confirmation");  // You would create this page next
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
                onPlaceOrder={placeOrder}
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
              // onPlaceOrder={placeOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;