
// import React from "react";
// import { Link } from "react-router-dom";

// const Fallback = ({ isLoading, error, noUser, emptyMessage, emptyActionText = "Continue Shopping", emptyActionPath = "/shop" }) => {
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="text-gray-600 text-lg">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-md p-6 text-center">
//           <p className="text-red-600 text-lg mb-4">
//             Error: {error?.data?.message || error.message || "Something went wrong"}
//           </p>
//           <Link
//             to={emptyActionPath}
//             className="inline-block bg-orange-800/90 hover:bg-orange-800 text-white font-medium px-6 py-2 rounded-lg transition-colors"
//           >
//             {emptyActionText}
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (noUser) {
//     return (
//       <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-md p-6 text-center">
//           <p className="text-gray-600 text-lg mb-4">Please log in to view this content.</p>
//           <Link
//             to="/login"
//             className="inline-block bg-orange-800/90 hover:bg-orange-800 text-white font-medium px-6 py-2 rounded-lg transition-colors"
//           >
//             Log In
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (emptyMessage) {
//     return (
//       <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-md p-12 text-center">
//           <p className="text-gray-500 text-lg mb-4">{emptyMessage}</p>
//           <Link
//             to={emptyActionPath}
//             className="inline-block bg-orange-800/90 hover:bg-orange-800 text-white font-medium px-6 py-2 rounded-lg transition-colors"
//           >
//             {emptyActionText}
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default Fallback;


// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion"; // For animations

// const Fallback = ({
//   isLoading,
//   error,
//   noUser,
//   emptyMessage,
//   emptyActionText = "Continue Shopping",
//   emptyActionPath = "/shop",
// }) => {
//   // Animation variants for smooth transitions
//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//   };

//   if (isLoading) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
//           <p className="text-gray-700 text-xl font-medium">Loading your cart...</p>
//         </div>
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full border border-red-100">
//           <svg
//             className="w-16 h-16 text-red-500 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <p className="text-red-600 text-xl font-semibold mb-4">
//             Error: {error?.data?.message || error.message || "Something went wrong"}
//           </p>
//           <Link
//             to={emptyActionPath}
//             className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-300"
//           >
//             {emptyActionText}
//           </Link>
//         </div>
//       </motion.div>
//     );
//   }

//   if (noUser) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full border border-gray-100">
//           <svg
//             className="w-16 h-16 text-orange-500 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z"
//             />
//           </svg>
//           <p className="text-gray-700 text-xl font-semibold mb-4">
//             Please log in to view this content
//           </p>
//           <Link
//             to="/login"
//             className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-300"
//           >
//             Log In
//           </Link>
//         </div>
//       </motion.div>
//     );
//   }

//   if (emptyMessage) {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="flex items-center justify-center"
//       >
//         <div className="bg-white rounded-3xl shadow-lg p-8 my-20 text-center max-w-md w-full border border-gray-100">
//           <svg
//             className="w-16 h-16 text-gray-500 mx-auto mb-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//             />
//           </svg>
//           <p className="text-gray-600 text-xl font-semibold mb-4">{emptyMessage}</p>
//           <Link
//             to={emptyActionPath}
//             className="inline-block bg-gradient-to-r from-orange-800/90 to-orange-800 hover:from-orange-800 hover:to-orange-800 text-white font-medium px-6 py-3 rounded-lg  shadow-md transition-all duration-300"
//           >
//             {emptyActionText}
//           </Link>
//         </div>
//       </motion.div>
//     );
//   }

//   return null;
// };

// export default Fallback;


import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

const Fallback = ({
  isLoading,
  error,
  noUser,
  emptyMessage,
  emptyActionText = "Continue Shopping",
  emptyActionPath = "/shop",
}) => {
  // Animation variants for smooth transitions
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading your cart...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full border border-red-100">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 text-xl font-semibold mb-4">
            Error: {error?.data?.message || error.message || "Something went wrong"}
          </p>
          <Link
            to={emptyActionPath}
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-300"
          >
            {emptyActionText}
          </Link>
        </div>
      </motion.div>
    );
  }

  if (noUser) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md w-full border border-gray-100">
          <svg
            className="w-16 h-16 text-orange-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z"
            />
          </svg>
          <p className="text-gray-700 text-xl font-semibold mb-4">
            Please log in to view this content
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-300"
          >
            Log In
          </Link>
        </div>
      </motion.div>
    );
  }

  if (emptyMessage) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex items-center justify-center"
      >
        <div className="bg-transparent p-8 my-20 text-center max-w-md w-full">
          <svg
            className="w-16 h-16 text-gray-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-gray-600 text-xl font-semibold mb-4">{emptyMessage}</p>
          <Link
            to={emptyActionPath}
            className="inline-block bg-gradient-to-r from-orange-800/90 to-orange-800 hover:from-orange-800 hover:to-orange-800 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300"
          >
            {emptyActionText}
          </Link>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default Fallback;