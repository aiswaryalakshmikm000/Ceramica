import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '../../features/auth/userApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import banner1 from "../../assets/Banners/banner1.jpg";
import GoogleIcon from "../../assets/google-icon.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address (ending with @gmail.com)')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await register(values).unwrap();
      
      if (response.success) {
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
        }, 2000);
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed', {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleSuccess = urlParams.get('success');
    const message = urlParams.get('message');

    if (googleSuccess === 'true') {
      toast.success(message || 'Google registration successful!', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/login', { state: { message: 'Google registration successful! Please log in.' } });
      }, 2000);
    } else if (googleSuccess === 'false' && message) {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${banner1})` }}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white/20 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">Register</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                  <ErrorMessage 
                    name="email" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                  <ErrorMessage 
                    name="phone" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                  <ErrorMessage 
                    name="password" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                  <ErrorMessage 
                    name="confirmPassword" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link 
                    to="/login" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Already have an account? Sign in
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 w-1/4"></div>
          <span className="px-3 text-gray-600 text-sm">OR</span>
          <div className="border-t border-gray-300 w-1/4"></div>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-200 bg-white/50 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;