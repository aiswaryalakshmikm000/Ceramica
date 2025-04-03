// components/Fallback.jsx
import React from "react";
import { Link } from "react-router-dom";

const Fallback = ({ isLoading, error, noUser, emptyMessage, emptyActionText = "Continue Shopping", emptyActionPath = "/shop" }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-red-600 text-lg mb-4">
            Error: {error?.data?.message || error.message || "Something went wrong"}
          </p>
          <Link
            to={emptyActionPath}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {emptyActionText}
          </Link>
        </div>
      </div>
    );
  }

  if (noUser) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-600 text-lg mb-4">Please log in to view this content.</p>
          <Link
            to="/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (emptyMessage) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">{emptyMessage}</p>
          <Link
            to={emptyActionPath}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {emptyActionText}
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default Fallback;