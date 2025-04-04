import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterMutation, useSendOTPMutation } from "../../features/userAuth/userApiSlice";
import OTPEnterModal from "./OTPEnterModal";
import banner2 from "../../assets/Banners/banner2.jpg";
import PasswordInput from "./PasswordInputView";
import { FaCamera } from "react-icons/fa";

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
  image: Yup.mixed().required("Profile Pic is required"),
});

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [sendOTP] = useSendOTPMutation();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      if (values.image) {
        formData.append("image", values.image);
      }

      await register(formData).unwrap();
      await sendOTP({ email: values.email }).unwrap();
      
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
    if (response.success) {
      toast.success(response.message || "Registration successful!");
      setShowOTPModal(false);
      navigate("/login");
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-9"
      style={{ backgroundImage: `url(${banner2})` }}
    >
      <div className="max-w-md w-full space-y-8 p-8 mt-10 bg-white/20 rounded-xl shadow-2xl backdrop-blur-md border border-white/20">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">
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
          {({ isSubmitting, setFieldValue }) => (
            <Form className="mt-8 space-y-6" encType="multipart/form-data">
              <div className="space-y-5">
                {/* Profile Picture Upload */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">Add Profile Pic</span>
                      )}
                    </div>
                    <label
                      htmlFor="image"
                      className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                    >
                      <FaCamera className="text-white" />
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImageChange(event, setFieldValue)}
                      />
                    </label>
                  </div>
                </div>
                <ErrorMessage
                  name="image"
                  render={(msg) => (
                    <p className="text-red-500 text-xs mt-1 font-medium text-center">{msg}</p>
                  )}
                />

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
                {/* Rest of the form fields remain the same */}
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
                
                <PasswordInput
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
                
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                />
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