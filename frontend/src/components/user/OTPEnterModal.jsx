// // components/OTPEnterModal.jsx
// import React, { Fragment, useState, useEffect } from "react";
// import { Transition, Dialog } from "@headlessui/react";
// import { useSendOTPMutation, useVerifyOTPMutation } from '../../features/auth/userApiSlice';
// import { toast } from "react-toastify";

// const OTPEnterModal = ({
//   isOpen,
//   closeModal,
//   email,
//   onVerifySuccess,
//   type = 'register',
// }) => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timeLeft, setTimeLeft] = useState(60); // 1 min

//   // Use provided mutations or default to imported ones
//   const [sendOTP, { isLoading: isSending }] = useSendOTPMutation();
//   const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();

//   // Send OTP when modal opens
//   useEffect(() => {
//     if (isOpen && email) {
//       handleSendOTP();
//     }
//   }, [isOpen, email]);

//   // Timer logic
//   useEffect(() => {
//     if (!isOpen) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isOpen]);

//   const handleSendOTP = async () => {
//     try {
//       const response = await sendOTP({ email }).unwrap();
//       toast.success(response.message); // "OTP sent successfully"
//       setTimeLeft(60); // Reset timer on resend
//     } catch (err) {
//       const errorMessage = err.data?.message || 'Failed to send OTP';
//       toast.error(errorMessage); // "Invalid email address", "user already exist", or "Internal server error."
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const otpString = otp.join("");
//     try {
//       const response = await verifyOTP({ email, otp: otpString }).unwrap();
//       toast.success(response.message); // "OTP verified successfully"
//       onVerifySuccess(response);
//       setTimeout(() => {
//         closeModal();
//         setOtp(["", "", "", "", "", ""]);
//       }, 1000);
//     } catch (err) {
//       const errorMessage = err.data?.message || 'Failed to verify OTP';
//       toast.error(errorMessage); // "OTP is not valid" or "OTP expired"
//     }
//   };

//   const handleChange = (element, index) => {
//     if (isNaN(element.value)) return;
//     setOtp([...otp.map((data, idx) => (idx === index ? element.value : data))]);
//     if (element.nextSibling && element.value) {
//       element.nextSibling.focus();
//     }
//   };

//   const handleResendOtp = () => {
//     setOtp(["", "", "", "", "", ""]);
//     setTimeLeft(60);
//     handleSendOTP();
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={closeModal}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                   {type === 'register' ? 'Verify Your Email' : 'Reset Password'}
//                 </Dialog.Title>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Please enter the 6-digit OTP sent to {email}.
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="mt-4">
//                   <div className="flex justify-center space-x-2">
//                     {otp.map((data, index) => (
//                       <input
//                         className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
//                         type="text"
//                         name="otp"
//                         maxLength="1"
//                         key={index}
//                         value={data}
//                         onChange={(e) => handleChange(e.target, index)}
//                         onFocus={(e) => e.target.select()}
//                       />
//                     ))}
//                   </div>
//                   <div className="text-center mt-4">
//                     <p className="text-sm text-gray-500">
//                       Time Remaining:{" "}
//                       <span className="font-medium">
//                         {Math.floor(timeLeft % 60).toString().padStart(2, "0")}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="mt-4">
//                     <button
//                       type="submit"
//                       disabled={isVerifying || otp.join("").length !== 6}
//                       className={`w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white ${
//                         isVerifying || otp.join("").length !== 6
//                           ? 'opacity-50 cursor-not-allowed'
//                           : 'hover:bg-gray-700'
//                       } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2`}
//                     >
//                       {isVerifying ? 'Verifying...' : 'Verify OTP'}
//                     </button>
//                   </div>
//                 </form>

//                 <div className="mt-4">
//                   <button
//                     onClick={handleResendOtp}
//                     disabled={timeLeft > 0 || isSending}
//                     className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
//                       timeLeft > 0 || isSending
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-blue-600 hover:bg-blue-700'
//                     } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
//                   >
//                     {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : isSending ? 'Sending...' : 'Resend OTP'}
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default OTPEnterModal;



// import React, { Fragment, useState, useEffect } from "react";
// import { Transition, Dialog } from "@headlessui/react";
// import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useSendOTPMutation,
//   useVerifyOTPMutation,
//   useResendOTPMutation,
//   useVerifyResetOTPMutation,
// } from "../../features/auth/userApiSlice";

// const OTPEnterModal = ({ isOpen, closeModal, email, onVerifySuccess }) => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const location = useLocation();

//   // Determine flow based on URL
//   const isRegisterFlow = location.pathname.includes("/register");
//   const isResetFlow = location.pathname.includes("/forgot-password");

//   // Destructure mutations with isLoading states
//   const [sendOTP, { isLoading: isSendingRegister }] = useSendOTPMutation();
//   const [verifyOTP, { isLoading: isVerifyingRegister }] = useVerifyOTPMutation();
//   const [resendOTP, { isLoading: isSendingReset }] = useResendOTPMutation();
//   const [verifyResetOTP, { isLoading: isVerifyingReset }] = useVerifyResetOTPMutation();

//   // Dynamically select mutations and loading states
//   const sendMutation = isRegisterFlow ? sendOTP : resendOTP;
//   const verifyMutation = isRegisterFlow ? verifyOTP : verifyResetOTP;
//   const isSending = isRegisterFlow ? isSendingRegister : isSendingReset;
//   const isVerifying = isRegisterFlow ? isVerifyingRegister : isVerifyingReset;

//   // Send OTP only for registration flow when modal opens
//   useEffect(() => {
//     if (isOpen && email && isRegisterFlow) {
//       handleSendOTP();
//     }
//   }, [isOpen, email, isRegisterFlow]);

//   // Timer logic
//   useEffect(() => {
//     if (!isOpen) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isOpen]);

//   const handleSendOTP = async () => {
//     try {
//       const response = await sendMutation({ email }).unwrap();
//       toast.success(response.message);
//       setTimeLeft(60);
//     } catch (err) {
//       const errorMessage = err.data?.message || "Failed to send OTP";
//       toast.error(errorMessage);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const otpString = otp.join("");
//     try {
//       const response = await verifyMutation({ email, otp: otpString }).unwrap();
//       toast.success(response.message);
//       onVerifySuccess(response);
//       setTimeout(() => {
//         closeModal();
//         setOtp(["", "", "", "", "", ""]);
//       }, 1000);
//     } catch (err) {
//       const errorMessage = err.data?.message || "Failed to verify OTP";
//       toast.error(errorMessage);
//     }
//   };

//   const handleChange = (element, index) => {
//     if (isNaN(element.value)) return;
//     setOtp([...otp.map((data, idx) => (idx === index ? element.value : data))]);
//     if (element.nextSibling && element.value) {
//       element.nextSibling.focus();
//     }
//   };

//   const handleResendOtp = () => {
//     setOtp(["", "", "", "", "", ""]);
//     setTimeLeft(60);
//     handleSendOTP();
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={closeModal}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                   {isRegisterFlow ? "Verify Your Email" : "Reset Password"}
//                 </Dialog.Title>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Please enter the 6-digit OTP sent to {email}.
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="mt-4">
//                   <div className="flex justify-center space-x-2">
//                     {otp.map((data, index) => (
//                       <input
//                         className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
//                         type="text"
//                         name="otp"
//                         maxLength="1"
//                         key={index}
//                         value={data}
//                         onChange={(e) => handleChange(e.target, index)}
//                         onFocus={(e) => e.target.select()}
//                       />
//                     ))}
//                   </div>
//                   <div className="text-center mt-4">
//                     <p className="text-sm text-gray-500">
//                       Time Remaining:{" "}
//                       <span className="font-medium">
//                         {Math.floor(timeLeft % 60).toString().padStart(2, "0")}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="mt-4">
//                     <button
//                       type="submit"
//                       disabled={isVerifying || otp.join("").length !== 6}
//                       className={`w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white ${
//                         isVerifying || otp.join("").length !== 6
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:bg-gray-700"
//                       } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2`}
//                     >
//                       {isVerifying ? "Verifying..." : "Verify OTP"}
//                     </button>
//                   </div>
//                 </form>

//                 <div className="mt-4">
//                   <button
//                     onClick={handleResendOtp}
//                     disabled={timeLeft > 0 || isSending}
//                     className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
//                       timeLeft > 0 || isSending
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700"
//                     } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
//                   >
//                     {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : isSending ? "Sending..." : "Resend OTP"}
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default OTPEnterModal;


// OTPEnterModal.jsx
import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useVerifyOTPMutation,
  useResendOTPMutation,
  useVerifyResetOTPMutation,
} from "../../features/auth/userApiSlice";

const OTPEnterModal = ({ isOpen, closeModal, email, onVerifySuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const location = useLocation();

  // Determine flow based on URL
  const isRegisterFlow = location.pathname.includes("/register");
  const isResetFlow = location.pathname.includes("/forgot-password");

  // Destructure mutations with isLoading states
  const [verifyOTP, { isLoading: isVerifyingRegister }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isSendingReset }] = useResendOTPMutation();
  const [verifyResetOTP, { isLoading: isVerifyingReset }] = useVerifyResetOTPMutation();

  // Dynamically select mutations and loading states
  const verifyMutation = isRegisterFlow ? verifyOTP : verifyResetOTP;
  const isVerifying = isRegisterFlow ? isVerifyingRegister : isVerifyingReset;

  // Timer logic
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    console.log("handle submit from the otp enter modal")
    e.preventDefault();
    const otpString = otp.join("");
    try {
      const response = await verifyMutation({ email, otp: otpString }).unwrap();
      toast.success(response.message);
      onVerifySuccess(response);
      setTimeout(() => {
        closeModal();
        setOtp(["", "", "", "", "", ""]);
      }, 1000);
    } catch (err) {
      const errorMessage = err.data?.message;
      console.log("varification error",err.data?.message)
      toast.error(errorMessage);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((data, idx) => (idx === index ? element.value : data))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleResendOtp = async () => {
    console.log("handle resend otp  from the otp enter modal")
    try {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60);
      const response = await resendOTP({ email }).unwrap();
      toast.success(response.message);
    } catch (err) {
      const errorMessage = err.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {isRegisterFlow ? "Verify Your Email" : "Reset Password"}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please enter the 6-digit OTP sent to {email}.
                  </p>
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
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Time Remaining:{" "}
                      <span className="font-medium">
                        {Math.floor(timeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isVerifying || otp.join("").length !== 6}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white ${
                        isVerifying || otp.join("").length !== 6
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-700"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2`}
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
                      timeLeft > 0 || isSendingReset
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
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