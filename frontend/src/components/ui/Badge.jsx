
import React from 'react';
import { cn } from "@/lib/utils";

const Badge = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "new":
        return "bg-ceramic-accent text-white";
      case "sale":
        return "bg-ceramic-danger text-white";
      case "outOfStock":
        return "bg-ceramic-muted text-ceramic-dark";
      case "discount":
        return "bg-ceramic-warning text-ceramic-dark";
      default:
        return "bg-ceramic-dark text-white";
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