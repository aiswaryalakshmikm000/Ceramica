import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userAuth/userAuthSlice';
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Wallet,
  Ticket,
  ChevronRight,
  ShoppingCart,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const userId = user?._id;

  const menuItems = [
    {
      title: "My Profile",
      icon: <User size={20} />,
      path: userId ? `/profile/${userId}` : "/login"
    },
    {
      title: "Address",
      icon: <MapPin size={20} />,
      path: userId ? `/address/${userId}` : "/login"
    },
    {
      title: "My Orders",
      icon: <ShoppingBag size={20} />,
      path: userId ? "/orders" : "/login"
    },
    {
      title: "My Cart",
      icon: <ShoppingCart size={20} />,
      path: userId ? `/cart/${userId}` : "/login"
    },
    {
      title: "My Wishlist",
      icon: <Heart size={20} />,
      path: userId ? `/wishlist/${userId}` : "/login"
    },
    {
      title: "Wallet",
      icon: <Wallet size={20} />,
      path: userId ? `/wallet/${userId}` : "/login"
    },
    {
      title: "Coupons",
      icon: <Ticket size={20} />,
      path: userId ? "/coupons" : "/login"
    },
  ];

  // Animation variants
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      }
    },
    exit: { 
      x: "-100%",
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
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4
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
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 rounded-r-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-5 border-b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <User size={24} className="text-orange-800" />
                  <h2 className="text-lg font-semibold text-ceramic-charcoal">
                    My Account
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

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-white to-orange-50/20">
                <div className="space-y-2 py-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Link 
                        to={item.path} 
                        onClick={onClose}
                        className={`flex items-center justify-between w-full p-4 rounded-lg transition-all duration-300 group
                          ${location.pathname === item.path 
                            ? 'bg-orange-800/90 text-white' 
                            : 'hover:bg-orange-800/10'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            className={`${location.pathname === item.path 
                              ? 'text-white' 
                              : 'text-orange-800 group-hover:text-orange-800'}`}
                          >
                            {item.icon}
                          </motion.div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={18} className="opacity-50 group-hover:opacity-100" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                className="p-5 border-t text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-sm text-gray-500"
                >
                  Ceramica © {new Date().getFullYear()}
                </motion.div>
                {/* {!user && (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center justify-center w-full mt-4 py-3 bg-orange-800 text-white rounded-lg hover:bg-orange-900 transition-colors duration-300 font-medium"
                  >
                    Sign In / Register
                  </Link>
                )} */}
                {/* {user && (
                  <Link
                    to="/logout"
                    onClick={onClose}
                    className="flex items-center justify-center w-full mt-4 py-2 border border-orange-800 text-orange-800 rounded-lg hover:bg-orange-50 transition-colors duration-300 font-medium text-sm"
                  >
                    Log Out
                  </Link>
                )} */}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;