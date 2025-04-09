import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric',  minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600"
        >
          No order details available. Redirecting...
        </motion.p>
        {setTimeout(() => navigate("/shop"), 2000)}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50/50 py-20 my-2 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8"
        variants={itemVariants}
      >
        <motion.div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            variants={checkmarkVariants}
          >
            <CheckCircle size={40} className="text-green-600" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-2"
            variants={itemVariants}
          >
            Thank You for Your Order!
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            variants={itemVariants}
          >
            Your order has been placed successfully
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 rounded-lg p-6 mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>
          </div>
          <motion.div 
            className="border-t border-gray-200 pt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
            <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.button 
            onClick={() => navigate(`/orders/${order.orderNumber}`)}
            className="w-full flex items-center justify-center py-3 px-4 border border-orange-600 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={18} className="mr-2" />
            View Your Order
          </motion.button>
          
          <motion.button 
            onClick={() => navigate("/shop")}
            className="w-full flex items-center justify-center py-3 px-4 bg-orange-800/90 hover:bg-orange-800 text-white rounded-lg transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
            <motion.div
              className="ml-2 inline-flex"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;