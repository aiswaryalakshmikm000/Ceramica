
// import React, { useEffect, useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useRegisterMutation, useSendOTPMutation, useVerifyOTPMutation } from '../../features/auth/userApiSlice';
// import { Link, useNavigate } from 'react-router-dom';
// import banner1 from "../../assets/Banners/banner1.jpg";
// import GoogleIcon from "../../assets/google-icon.png";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import OTPEnterModal from './OTPEnterModal'; 

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   name: Yup.string()
//     .min(2, 'Name must be at least 2 characters')
//     .required('Name is required'),
//   email: Yup.string()
//     .email('Invalid email format')
//     .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address (ending with @gmail.com)')
//     .required('Email is required'),
//   phone: Yup.string()
//     .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Phone number must be exactly 10 digits')
//     .required('Phone number is required'),
//   password: Yup.string()
//     .min(6, 'Password must be at least 6 characters')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
//     .required('Password is required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match')
//     .required('Confirm password is required'),
// });

// const UserRegisterPage = () => {
//   const navigate = useNavigate();
//   const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
//   const [sendOTP] = useSendOTPMutation();
//   const [verifyOTP] = useVerifyOTPMutation();
//   const [showOTPModal, setShowOTPModal] = useState(false);
//   const [formValues, setFormValues] = useState(null); // To store form data for registration

//   const initialValues = {
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   };

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       // Store form values and show OTP modal instead of immediate registration
//       setFormValues(values);
//       setShowOTPModal(true);
//     } catch (err) {
//       toast.error(err?.data?.message || 'Something went wrong', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//     setSubmitting(false);
//   };

//   const handleOTPVerifySuccess = async (response) => {
//     if (response.success) {
//       try {
//         // After OTP verification, proceed with registration
//         const registerResponse = await register(formValues).unwrap();
//         if (registerResponse.success) {
//           toast.success('Registration successful! Redirecting to login...', {
//             position: "top-right",
//             autoClose: 2000,
//           });
//           setTimeout(() => {
//             navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
//           }, 2000);
//         }
//       } catch (err) {
//         toast.error(err?.data?.message || 'Registration failed after OTP verification', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const googleSuccess = urlParams.get('success');
//     const message = urlParams.get('message');

//     if (googleSuccess === 'true') {
//       toast.success(message || 'Google registration successful!', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//       setTimeout(() => {
//         navigate('/login', { state: { message: 'Google registration successful! Please log in.' } });
//       }, 2000);
//     } else if (googleSuccess === 'false' && message) {
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   }, [navigate]);

//   const handleGoogleSignIn = () => {
//     window.location.href = 'http://localhost:5000/api/auth/google';
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: `url(${banner1})` }}
//     >
//       <div className="max-w-md w-full space-y-10 p-8 bg-white/20 rounded-xl shadow-xl backdrop-blur-sm">
//         <div className="text-center">
//           <h2 className="mt-6 text-2xl font-bold text-gray-900 tracking-tight">Sign Up</h2>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="mt-8 space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <Field
//                     name="name"
//                     type="text"
//                     placeholder="Full Name"
//                     className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
//                   />
//                   <ErrorMessage 
//                     name="name" 
//                     component="div" 
//                     className="text-red-500 text-sm mt-1" 
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="email"
//                     type="email"
//                     placeholder="Email address"
//                     className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
//                   />
//                   <ErrorMessage 
//                     name="email" 
//                     component="div" 
//                     className="text-red-500 text-sm mt-1" 
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="phone"
//                     type="tel"
//                     placeholder="Phone Number"
//                     className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
//                   />
//                   <ErrorMessage 
//                     name="phone" 
//                     component="div" 
//                     className="text-red-500 text-sm mt-1" 
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="password"
//                     type="password"
//                     placeholder="Password"
//                     className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
//                   />
//                   <ErrorMessage 
//                     name="password" 
//                     component="div" 
//                     className="text-red-500 text-sm mt-1" 
//                   />
//                 </div>

//                 <div>
//                   <Field
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="Confirm Password"
//                     className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
//                   />
//                   <ErrorMessage 
//                     name="confirmPassword" 
//                     component="div" 
//                     className="text-red-500 text-sm mt-1" 
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="text-sm">
//                   <Link 
//                     to="/login" 
//                     className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
//                   >
//                     Already have an account? Sign in
//                   </Link>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isRegisterLoading}
//                   className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   {isSubmitting || isRegisterLoading ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Registering...
//                     </span>
//                   ) : (
//                     'Register'
//                   )}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>

//         <div className="mt-6 flex items-center justify-center">
//           <div className="border-t border-gray-300 w-1/4"></div>
//           <span className="px-3 text-gray-600 text-sm">OR</span>
//           <div className="border-t border-gray-300 w-1/4"></div>
//         </div>

//         <div className="mt-4 flex items-center justify-center">
//           <button
//             onClick={handleGoogleSignIn}
//             className="group relative w-full flex justify-center py-3 px-4 border border-gray-200 bg-white/50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
//           >
//             <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
//             Sign up with Google
//           </button>
//         </div>
//       </div>

//       {/* OTP Modal */}
//       <OTPEnterModal
//         isOpen={showOTPModal}
//         closeModal={() => setShowOTPModal(false)}
//         email={formValues?.email || ''}
//         onVerifySuccess={handleOTPVerifySuccess}
//         type="register"
//         useSendOTPMutation={sendOTP}
//         useVerifyOTPMutation={verifyOTP}
//       />
//     </div>
//   );
// };

// export default UserRegisterPage;

// UserRegisterPage.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterMutation, useSendOTPMutation } from "../../features/auth/userApiSlice";
import OTPEnterModal from "./OTPEnterModal";
import banner2 from "../../assets/Banners/banner2.jpg";

const registerValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(/@gmail\.com$/, "Only Gmail addresses are allowed"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .length(10, "Phone number must be exactly 10 digits"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [sendOTP] = useSendOTPMutation();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("handle submit from the user register page")
    try {

      // Then attempt registration
      await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      }).unwrap();

      // First send OTP
      await sendOTP({ email: values.email }).unwrap();
    
      
      // If both succeed, show OTP modal
      setFormValues(values);
      setShowOTPModal(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to initiate registration";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPVerifySuccess = async (response) => {
    console.log("handle otp varify sucess from the user register page")
    if (response.success) {
      toast.success(response.message || "Registration successful!");
      setShowOTPModal(false);
      navigate("/login");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${banner2})` }}
    >
      <div className="max-w-md w-full space-y-8 p-8 mt-10 bg-white/20 rounded-xl shadow-2xl backdrop-blur-md border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">
            Register
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-300 hover:border-indigo-400"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage
                    name="name"
                    render={(msg) => (
                      <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-300 hover:border-indigo-400"
                    placeholder="e.g., user@gmail.com"
                  />
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1">
                    Phone
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-300 hover:border-indigo-400"
                    placeholder="Enter your 10-digit phone number"
                  />
                  <ErrorMessage
                    name="phone"
                    render={(msg) => (
                      <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-300 hover:border-indigo-400"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    render={(msg) => (
                      <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-300 hover:border-indigo-400"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    render={(msg) => (
                      <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <OTPEnterModal
        isOpen={showOTPModal}
        closeModal={() => setShowOTPModal(false)}
        email={formValues?.email || ""}
        onVerifySuccess={handleOTPVerifySuccess}
      />
    </div>
  );
};

export default UserRegisterPage;