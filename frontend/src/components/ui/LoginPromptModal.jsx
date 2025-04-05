import React from 'react';
import { X, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-3000 ease-in-out"
        style={{ opacity: isOpen ? 0.5 : 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`bg-white rounded-lg shadow-2xl w-11/12 max-w-md p-6 absolute right-4 ${
          isOpen
            ? 'animate__animated animate__slideInUp animate__slower top-[25%] opacity-100'
            : 'top-[100vh] opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Unlock Exclusive Benefits!
        </h2>

        {/* Promotional Content */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Login now to enjoy exclusive offers, save items to your wishlist, and add them to your cart effortlessly!
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                <Heart size={20} className="text-orange-800" />
              </span>
              <span className="text-sm text-gray-700">Wishlist</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                <ShoppingCart size={20} className="text-orange-800" />
              </span>
              <span className="text-sm text-gray-700">Add to Cart</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="w-full flex items-center justify-center py-3 bg-orange-800/90 text-white rounded-md hover:bg-orange-800 transition-colors font-semibold"
          onClick={() => navigate('/login')}
        >
          Login Now
          <ArrowRight className="ml-2" size={20} />
        </button>

        {/* Optional: Continue as Guest */}
        <button
          className="w-full mt-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          onClick={onClose}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;


// import React from 'react';
// import { X, ArrowRight, Heart, ShoppingCart } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion'; 

// const LoginPromptModal = ({ isOpen, onClose }) => {
//   const navigate = useNavigate();

//   // Animation variants
//   const overlayVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { duration: 0.3 }
//     },
//     exit: { 
//       opacity: 0,
//       transition: { duration: 0.2 }
//     }
//   };

//   const modalVariants = {
//     hidden: { opacity: 0, y: 50, scale: 0.9 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       scale: 1,
//       transition: { 
//         type: "spring", 
//         damping: 25, 
//         stiffness: 300 
//       }
//     },
//     exit: { 
//       opacity: 0,
//       y: 20,
//       scale: 0.95,
//       transition: { duration: 0.2 }
//     }
//   };

//   const featureVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: (i) => ({ 
//       opacity: 1, 
//       x: 0,
//       transition: { 
//         delay: i * 0.15 + 0.3,
//         duration: 0.5
//       }
//     })
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           {/* Backdrop */}
//           <motion.div 
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={onClose}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             variants={overlayVariants}
//           />

//           {/* Modal Content */}
//           <motion.div 
//             className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-xl overflow-hidden"
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             variants={modalVariants}
//           >
//             {/* Close Button */}
//             <motion.button
//               onClick={onClose}
//               className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-300 z-10"
//               whileHover={{ rotate: 90, backgroundColor: "#fee2e2" }}
//               transition={{ duration: 0.2 }}
//             >
//               <X size={18} />
//             </motion.button>

//             {/* Modal Header with Gradient */}
//             <div className="bg-gradient-to-r from-orange-800/20 to-orange-700/20 pt-12 pb-6 px-8 text-white">
//               <motion.h3 
//                 className="text-2xl font-bold tracking-tight"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//               >
//                 Unlock Exclusive Benefits!
//               </motion.h3>
//             </div>

//             {/* Promotional Content */}
//             <div className="px-8 py-6 bg-white">
//               <motion.div 
//                 className="mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <p className="text-gray-700 leading-relaxed">
//                   Login now to enjoy exclusive offers, save items to your wishlist, and add them to your cart effortlessly!
//                 </p>
//               </motion.div>

//               <div className="space-y-4 mb-8">
//                 <motion.div 
//                   className="flex items-center space-x-3"
//                   custom={0}
//                   initial="hidden"
//                   animate="visible"
//                   variants={featureVariants}
//                 >
//                   <div className="p-2 rounded-full bg-orange-800/10 text-orange-800">
//                     <Heart size={18} />
//                   </div>
//                   <span className="text-gray-800 font-medium">Save to Wishlist</span>
//                 </motion.div>

//                 <motion.div 
//                   className="flex items-center space-x-3"
//                   custom={1}
//                   initial="hidden"
//                   animate="visible"
//                   variants={featureVariants}
//                 >
//                   <div className="p-2 rounded-full bg-orange-800/10 text-orange-800">
//                     <ShoppingCart size={18} />
//                   </div>
//                   <span className="text-gray-800 font-medium">Easy Shopping Experience</span>
//                 </motion.div>

//                 <motion.div 
//                   className="flex items-center space-x-3"
//                   custom={2}
//                   initial="hidden"
//                   animate="visible"
//                   variants={featureVariants}
//                 >
//                   <div className="p-2 rounded-full bg-orange-800/10 text-orange-800">
//                     <ArrowRight size={18} />
//                   </div>
//                   <span className="text-gray-800 font-medium">Exclusive Offers</span>
//                 </motion.div>
//               </div>

//               {/* Login Button */}
//               <motion.button
//                 onClick={() => navigate('/login')}
//                 className="w-full py-3 bg-orange-800/90 text-white rounded-lg hover:bg-orange-800 transition-colors duration-300 font-medium flex items-center justify-center"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 Login Now
//                 <ArrowRight size={16} className="ml-2" />
//               </motion.button>

//               {/* Continue as Guest */}
//               <motion.button
//                 onClick={onClose}
//                 className="w-full mt-3 py-2 text-orange-800 hover:text-orange-900 font-medium text-sm transition-colors duration-300"
//                 whileHover={{ scale: 1.03 }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//               >
//                 Continue as Guest
//               </motion.button>
              
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default LoginPromptModal;
