import React from 'react';
import { cn } from '@/lib/utils';

const CustomButton = ({
  children,
  href,
  variant = 'default',
  size = 'default',
  className,
  ...props
}) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 transform hover:scale-105',
    {
      'bg-ceramic-orange text-white hover:bg-ceramic-dark-orange': variant === 'default',
      'border-2 border-ceramic-orange text-ceramic-orange hover:bg-ceramic-orange/10': variant === 'outline',
      'px-5 py-2': size === 'default',
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-7 py-2.5 text-lg': size === 'lg',
    },
    className
  );

  if (href) {
    return (
      <a href={href} className={baseStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseStyles} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;