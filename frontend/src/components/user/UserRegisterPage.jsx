import React, { useState } from 'react';
import { useRegisterMutation } from '../../features/auth/userApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import banner1 from "../../assets/Banners/banner1.jpg";

const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      setErrorMsg('All fields are required');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Invalid email format');
      return;
    }

    if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
      setErrorMsg('Invalid phone number format');
      return;
    }
    
    try {
      const response = await register(formData).unwrap();
      console.log('Registration response:', response); 

      if (response.success) {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } else {
        setErrorMsg('Registration successful but no user data returned');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Registration failed');
      console.error('Registration error:', err); 
    }
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center "
      style={{
        backgroundImage: `url(${banner1})`,
      }}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white/20 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">Ceramica</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>
        
        {errorMsg && (
          <div className="bg-red-100/80 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <span className="block sm:inline">{errorMsg}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 bg-white/50 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
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
        </form>
      </div>
    </div>
  );
};

export default UserRegisterPage;