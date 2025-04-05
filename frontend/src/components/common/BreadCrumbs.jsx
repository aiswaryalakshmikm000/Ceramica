import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumbs = ({ items = [] }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.nav 
      className="flex pb-5 pt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ol className="flex items-center space-x-1 text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index === items.length - 1 ? (
              <motion.li 
                className="text-ceramic-dark/60 font-medium relative"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative">
                  {item.label}
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ceramic-accent"
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  />
                </span>
              </motion.li>
            ) : (
              <>
                <motion.li
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    to={item.href} 
                    className="text-ceramic-dark/60 hover:text-ceramic-accent transition-colors relative"
                  >
                    <span className="relative group">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ceramic-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </Link>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ChevronRight size={14} className="text-ceramic-dark/40" />
                  </motion.div>
                </motion.li>
              </>
            )}
          </React.Fragment>
        ))}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumbs;