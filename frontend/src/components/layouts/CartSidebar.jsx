
import React from "react";
import { X, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsUserAuthenticated } from "../../features/userAuth/userAuthSlice";
import { useGetCartQuery } from "../../features/userAuth/userCartApislice";
import { motion, AnimatePresence } from "framer-motion"; 

const CartSidebar = ({ isOpen, onClose }) => {
  const user = useSelector(selectUser);
  const userId = user?._id;
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  // Fetch cart data using useGetCartQuery
  const { data: cart, isLoading, error } = useGetCartQuery(userId, {
    skip: !user, 
  });

  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    if (!cart || !cart.items) return "0.00";
    return cart.items
      .reduce((total, item) => total + item.latestPrice * item.quantity, 0)
      .toFixed(2);
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      }
    },
    exit: { 
      x: "100%",
      transition: { 
        ease: "easeInOut",
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 rounded-l-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-5 border-b bg-gradient-to-r to-orange-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart size={24} className="text-orange-800" />
                  <h2 className="text-lg font-semibold text-ceramic-charcoal">
                    Your Cart
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-orange-800/10 text-ceramic-charcoal transition-colors duration-300"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-white to-orange-50/10">
                {isLoading ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-16 h-16 border-4 border-orange-800 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <p className="mt-6 text-ceramic-charcoal font-medium">Loading cart...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-red-500 font-medium">
                      Error loading cart: {error?.data?.message || error.message}
                    </p>
                  </motion.div>
                ) : !cart || !cart.items || cart.items.length === 0 ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full py-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ y: 10 }}
                      animate={{ y: -10 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <Package size={90} className="mx-auto text-orange-800" strokeWidth={1.5} />
                    </motion.div>
                    <p className="mt-6 text-ceramic-charcoal font-medium text-lg">Your cart is empty</p>
                    <p className="text-gray-500 text-center mt-2">Add items to get started</p>
                  </motion.div>
                ) : (
                  <div className="space-y-1">
                    {cart.items.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${item.color}`}
                        className="flex items-center space-x-4 py-4 px-3 border-b hover:bg-orange-800/10 rounded-lg transition-colors duration-300"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-800/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-ceramic-charcoal line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.color}
                          </p>
                          <p className="text-xs text-orange-800 font-medium mt-1">
                            ₹{item.latestPrice.toFixed(0)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-orange-800">
                          ₹{(item.latestPrice * item.quantity).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Subtotal and Buttons */}
              <motion.div
                className="p-5 border-t bg-gradient-to-b"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLoading || error ? null : !cart || cart.items.length === 0 ? (
                  <div className="space-y-3">
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="flex items-center justify-center w-full py-3 bg-orange-800/90 text-white rounded-lg hover:bg-orange-800 transition-colors duration-300 font-medium group"
                    >
                      Continue Shopping
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </Link>

                    {!isAuthenticated && (<Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-center justify-center w-full py-3 bg-transparent border border-orange-800 text-orange-800 rounded-lg hover:bg-orange-50 transition-colors duration-300 font-medium"
                    >
                      Sign In / Register
                    </Link>)}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-5">
                      <span className="text-ceramic-charcoal font-medium">
                        Subtotal:
                      </span>
                      <motion.span 
                        className="text-orange-800 font-bold text-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        ₹{calculateSubtotal()}
                      </motion.span>
                    </div>
                    <div className="space-y-3">
                      <Link
                        to={`/cart/${userId}`}
                        onClick={onClose}
                        className="flex items-center justify-center w-full py-3 border-2 border-orange-800 rounded-lg text-orange-800 hover:bg-orange-50 transition-colors duration-300 font-medium"
                      >
                        View Cart
                      </Link>
                      <Link
                        to="/checkout"
                        onClick={onClose}
                        className="flex items-center justify-center w-full py-3 bg-orange-800 text-white rounded-lg hover:bg-orange-900 transition-colors duration-300 font-medium group"
                      >
                        Checkout
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Link>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">Free shipping on orders over ₹1500</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;