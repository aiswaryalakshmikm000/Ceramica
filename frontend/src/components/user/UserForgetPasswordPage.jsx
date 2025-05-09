
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner3 from "../../assets/Banners/banner3.jpg";
import OTPEnterModal from "./OTPEnterModal";
import ResetPasswordModal from "./ResetPasswordModal";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
} from "../../features/userAuth/userApiSlice";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(/@gmail\.com$/, "Only Gmail addresses are allowed"),
});


const UserForgetPasswordPage = () => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [email, setEmail] = useState("");
  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const initialValues = {
    email: "",
  };

  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await forgetPassword({ email: values.email }).unwrap();
      setEmail(values.email);
      setShowOTPModal(true);
      toast.success("OTP sent to your email successfully!");
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPVerifySuccess = (response) => {
    if (response.success) {
      toast.success(response.message);
      setShowOTPModal(false);
      setShowResetModal(true);
    }
  };

  const handleResetSuccess = (response) => {
    if (response.success) {
      toast.success("Password reset successfully!");
      setShowResetModal(false);
      navigate("/login")
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${banner3})` }}
    >
      <div className="max-w-md w-full space-y-8 p-8 mt-10 bg-white/20 rounded-xl shadow-2xl backdrop-blur-md border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 mb-9 text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">
            Reset your Password
          </h2>
          <p className="mt-2 text-sm text-gray-700 font-medium">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-800/50 focus:border-orange-800 sm:text-sm transition-all duration-300 hover:border-orange-800"
                    placeholder="e.g., user@gmail.com"
                  />
                  <ErrorMessage
                    name="email"
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
                    className="font-medium text-orange-800 hover:text-orange-800 transition-colors duration-200"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-orange-800/90 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
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
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
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
        email={email}
        onVerifySuccess={handleOTPVerifySuccess}
      />

      <ResetPasswordModal
        isOpen={showResetModal}
        closeModal={() => setShowResetModal(false)}
        email={email}
        onResetSuccess={handleResetSuccess}
        resetPasswordMutation={resetPassword}
      />
    </div>
  );
};

export default UserForgetPasswordPage;