import React from 'react';
import { cn } from "../../lib/utils";

const Badge = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "new":
        return "bg-blue-500/80 text-white"; // Test with a standard color
      case "discount":
        return "bg-red-500/90 text-black"; // Test with a standard color
      default:
        return "bg-gray-800/70 text-white"; // Test with a standard color
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300 shadow-sm",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;