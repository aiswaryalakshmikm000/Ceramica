// // Button.jsx
// import React from 'react';

// const Button = ({ 
//   children, 
//   onClick, 
//   color = '#B45F2C', 
//   hoverColor = '#934E24', // Added default hover color (a darker shade of orange)
//   className = '', 
//   type = 'button', 
//   disabled = false 
// }) => {
//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 
//         hover:scale-105 hover:opacity-100 
//         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
//         ${className}`}
//       style={{ backgroundColor: color }}
//       onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = hoverColor)}
//       onMouseLeave={(e) => !disabled && (e.target.style.backgroundColor = color)}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;