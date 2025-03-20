import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../features/auth/userApiSlice";
import { setUserCredentials } from "../../features/auth/userAuthSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleIcon from "../../assets/google-icon.png";
import banner1 from "../../assets/Banners/banner1.jpg";

// Yup validation schema with Gmail-specific validation
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(/@gmail\.com$/, "Only Gmail addresses are allowed"),
  password: Yup.string().required("Password is required"),
});

const UserLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setUserCredentials({ user: result.user }));
      toast.success(result.message || "Login successful");
      navigate("/");
    } catch (err) {
      const errorMessage = err?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${banner1})`,
      }}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white/40 rounded-xl shadow-2xl backdrop-blur-md border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">
            Login
          </h2>
          <p className="mt-2 text-sm text-gray-700 font-medium">
            Sign in to your account
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
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
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    Don’t have an account? Register
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isSubmitting || isLoading ? (
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
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="border-t border-gray-400 w-1/4" />
                <span className="text-gray-600 text-sm font-medium">OR</span>
                <div className="border-t border-gray-400 w-1/4" />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white/80 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
                  Sign in with Google
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserLoginPage;