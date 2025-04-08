// import React, { useState } from "react";
import { CreditCard, Wallet, BanknoteIcon, ChevronLeft, ChevronRight } from "lucide-react";

const paymentMethods = [
  {
    id: "credit-card",
    title: "Credit / Debit Card",
    icon: <CreditCard className="text-orange-800" />,
    description: "Pay securely with your card"
  },
  {
    id: "upi",
    title: "UPI Payment",
    icon: <Wallet className="text-orange-800" />,
    description: "Google Pay, PhonePe, Paytm & more"
  },
  {
    id: "Cash on Delivery",
    title: "Cash on Delivery",
    icon: <BanknoteIcon className="text-orange-800" />,
    description: "Pay when you receive your order"
  }
];

const PaymentStep = ({ onNext, onBack, selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const handleSelectPayment = (paymentId) => {
    setSelectedPaymentMethod(paymentId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="mr-2 text-orange-800" />
        <h2 className="text-2xl font-semibold text-gray-800">Payment Method</h2>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === method.id
                ? "border-orange-800/50 bg-orange-50"
                : "border-gray-200 hover:border-orange-800/50"
            }`}
            onClick={() => handleSelectPayment(method.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100">
                {method.icon}
              </div>
              <div>
                <h3 className="font-medium">{method.title}</h3>
                <p className="text-sm text-gray-800">{method.description}</p>
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

            {selectedPaymentMethod === method.id && method.id === "credit-card" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="XXX"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-orange-800 focus:ring-orange-800 h-4 w-4 mr-2"
                    />
                    <span className="text-sm text-gray-800">Save card for future payments</span>
                  </label>
                </div>
              </div>
            )}
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
          onClick={onNext}
          disabled={!selectedPaymentMethod}
          className={`flex items-center px-6 py-2 rounded-lg ${
            !selectedPaymentMethod 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-orange-800/90 hover:bg-orange-800 text-white"
          } transition-colors`}
        >
          Review Order
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;