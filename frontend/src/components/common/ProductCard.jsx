// import React, { useState } from 'react';
// import { Eye, ShoppingCart } from 'lucide-react';
// import { Link } from 'react-router-dom';

// // Currency formatter for INR
// const formatter = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   minimumFractionDigits: 2,
// });

// const ProductCard = ({ product }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div 
//       className="group hover-card"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Product Image */}
//       <div className="relative overflow-hidden rounded-lg aspect-square bg-ceramic-light">
//         <img 
//           src={product.image} 
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//           loading="lazy"
//         />
        
//         {/* Discount Badge */}
//         {product.discount > 0 && (
//           <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
//             {product.discount}% OFF
//           </span>
//         )}
        
//         {/* Overlay with actions on hover */}
//         <div className={`absolute inset-0 bg-ceramic-dark/30 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//           <Link 
//             to={`/shop/${product.id}`}
//             className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ceramic-dark hover:bg-ceramic-accent hover:text-white transition-colors"
//           >
//             <Eye size={18} />
//           </Link>
//           <button 
//             className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ceramic-dark hover:bg-ceramic-accent hover:text-white transition-colors"
//             onClick={() => console.log(`Added ${product.name} to cart`)}
//           >
//             <ShoppingCart size={18} />
//           </button>
//         </div>
//       </div>
      
//       {/* Product Info */}
//       <div className="pt-4 pb-2">
//         <h3 className="text-base font-medium text-ceramic-dark transition-colors group-hover:text-ceramic-accent">
//           {product.name}
//         </h3>
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center gap-2">
//             {product.discount > 0 ? (
//               <>
//                 <span className="text-ceramic-dark font-bold text-lg">
//                   {formatter.format(product.discountedPrice)}
//                 </span>
//                 <span className="text-ceramic-dark/50 line-through text-sm">
//                   {formatter.format(product.price)}
//                 </span>
//               </>
//             ) : (
//               <span className="text-ceramic-dark font-bold text-lg">
//                 {formatter.format(product.price)}
//               </span>
//             )}
//           </div>
//           {product.inStock ? (
//             <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
//           ) : (
//             <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import React, { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Currency formatter for INR
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group hover-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg aspect-square bg-ceramic-light">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        
        {/* Overlay with actions on hover */}
        <div className={`absolute inset-0 bg-ceramic-dark/30 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link 
            to={`/shop/${product.id}`}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ceramic-dark hover:bg-ceramic-accent hover:text-white transition-colors"
          >
            <Eye size={18} />
          </Link>
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ceramic-dark hover:bg-ceramic-accent hover:text-white transition-colors"
            onClick={() => console.log(`Added ${product.name} to cart`)}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="pt-4 pb-2">
        <h3 className="text-base font-medium text-ceramic-dark transition-colors group-hover:text-ceramic-accent">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-ceramic-dark font-bold text-lg">
              {formatter.format(product.discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-ceramic-dark/50 line-through text-sm">
                {formatter.format(product.price)}
              </span>
            )}
          </div>
          {product.inStock ? (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;