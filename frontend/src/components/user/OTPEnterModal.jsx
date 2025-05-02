
import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useVerifyOTPMutation,
  useResendOTPMutation,
  useVerifyResetOTPMutation,
} from "../../features/userAuth/userApiSlice";

const OTPEnterModal = ({ isOpen, closeModal, email, onVerifySuccess, flow }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const location = useLocation();

  const [verifyOTP, { isLoading: isVerifyingRegister }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isSendingReset }] = useResendOTPMutation();
  const [verifyResetOTP, { isLoading: isVerifyingReset }] = useVerifyResetOTPMutation();


  const isRegisterFlow = location.pathname.includes("/register");
  const isResetFlow = location.pathname.includes("/forgot-password");
  const isEmailChangeFlow = flow === "emailChange";
  const isPasswordChangeFlow = flow === "passwordChange";

  const verifyMutation = (isRegisterFlow || isEmailChangeFlow) ? verifyOTP : verifyResetOTP;
  const isVerifying = (isRegisterFlow || isEmailChangeFlow) ? isVerifyingRegister : isVerifyingReset;

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    try {
      const response = await verifyMutation({ email, otp: otpString }).unwrap();
      onVerifySuccess(response);
      setTimeout(() => {
        closeModal();
        setOtp(["", "", "", "", "", ""]);
      }, 1000);
    } catch (err) {
      toast.error(err.data?.message || "OTP verification failed");
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    } else if (!element.value && element.previousSibling) {
      element.previousSibling.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    const pastedArray = pastedData.split("").slice(0, 6 - index);

    for (let i = 0; i < pastedArray.length; i++) {
      if (index + i < 6) {
        newOtp[index + i] = pastedArray[i];
      }
    }

    setOtp(newOtp);
    const nextFocusIndex = Math.min(index + pastedArray.length, 5);
    document.getElementsByName("otp")[nextFocusIndex].focus();
  };

  const handleResendOtp = async () => {
    try {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      const response = await resendOTP({ email }).unwrap();
      toast.success(response.message || "OTP resent successfully");
    } catch (err) {
      toast.error(err.data?.message || "Failed to resend OTP");
    }
  };

  const getTitle = () => {
    if (isRegisterFlow) return "Verify Your Email";
    if (isResetFlow || isPasswordChangeFlow) return "Reset Password";
    if (isEmailChangeFlow) return "Verify Email Change";
    return "Verify OTP";
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {getTitle()}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Please enter the 6-digit OTP sent to {email}.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="flex justify-center space-x-2">
                    {otp.map((data, index) => (
                      <input
                        className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onPaste={(e) => handlePaste(e, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Time Remaining: <span className="font-medium">{Math.floor(timeLeft % 60).toString().padStart(2, "0")}</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isVerifying || otp.join("").length !== 6}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white ${
                        isVerifying || otp.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
                      }`}
                    >
                      {isVerifying ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || isSendingReset}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                      timeLeft > 0 || isSendingReset ? "bg-gray-400 cursor-not-allowed" : "bg-orange-800/90 hover:bg-orange-700"
                    }`}
                  >
                    {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : isSendingReset ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OTPEnterModal;