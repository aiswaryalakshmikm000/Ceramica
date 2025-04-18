

import React from "react";
import { CreditCard, Wallet, BanknoteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const paymentMethods = [
  {
    id: "Razorpay",
    title: "Razorpay",
    icon: <CreditCard className="text-gray-600" />,
    description: "Pay via UPI, Credit/Debit Card, Net Banking & more",
  },
  {
    id: "Wallet",
    title: "Wallet",
    icon: <Wallet className="text-gray-600" />,
    description: "Pay using your digital wallet balance",
  },
  {
    id: "Cash on Delivery",
    title: "Cash on Delivery",
    icon: <BanknoteIcon className="text-gray-600" />,
    description: "Pay when you receive your order",
  },
];

const PaymentStep = ({
  onNext,
  onBack,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  cart,
  selectedAddress,
}) => {
  const handleSelectPayment = (paymentId) => {
    setSelectedPaymentMethod(paymentId);
  };

  const handleNext = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!selectedAddress) {
      toast.error("Shipping address is required");
      return;
    }
    if (!cart?.totalAmount || cart.totalAmount <= 0) {
      toast.error("Cart amount is invalid");
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="mr-2 text-gray-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Payment Method</h2>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer ${
              selectedPaymentMethod === method.id ? "border border-gray-200" : ""
            }`}
            onClick={() => handleSelectPayment(method.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
                {method.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-orange-800">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className="ml-auto">
                <div
                  className={`h-5 w-5 rounded-full ${
                    selectedPaymentMethod === method.id
                      ? "bg-orange-800 ring-2 ring-orange-200"
                      : "border border-gray-300"
                  }`}
                >
                  {selectedPaymentMethod === method.id && (
                    <div className="h-2.5 w-2.5 m-1.25 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Address
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedPaymentMethod}
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !selectedPaymentMethod
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-800/90 hover:bg-orange-800 transition-colors"
          }`}
        >
          Review Order
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;