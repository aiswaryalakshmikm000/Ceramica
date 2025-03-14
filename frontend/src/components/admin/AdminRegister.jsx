import { useState } from "react";
import { useRegisterMutation } from "../../features/auth/adminApiSlice";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../features/auth/adminAuthSlice";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [errorMsg, setErrorMsg] = useState('');
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Invalid email format');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMsg('Phone must be a 10-digit number');
      return;
    }

    console.log(formData); // Log the data to check if all fields are present
    try {
      const response = await register(formData).unwrap();
      console.log('Admin Registration Success:', response);

      // Store admin data in Redux without implying authentication
      if (response.admin) {
        dispatch(setAdminCredentials({ admin: response.admin }));
      }
      navigate('/admin/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Registration failed');
      console.error('Admin Registration failed:', err);
    }
  };

  return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Register</h2>
        <p className="mt-2 text-sm text-gray-600">Create your admin account</p>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errorMsg}</span>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Phone (10 digits)"
              value={formData.phone} // Fixed from formData.mobile
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default AdminRegister;