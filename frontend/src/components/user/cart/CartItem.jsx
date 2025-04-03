
// import React from "react";
// import { Trash2 } from "lucide-react";
// import QuantityControl from "./QuantityControl";
// import { useNavigate } from "react-router-dom";

// const CartItem = ({
//   id,
//   name,
//   originalPrice,
//   latestPrice,
//   discount,
//   quantity,
//   image,
//   color,
//   onRemove,
//   onUpdateQuantity,
// }) => {
//   const discountedPrice = latestPrice;
//   const navigate = useNavigate();

//   const handleProductClick = (id) => {
//     navigate(`/shop/${id}`);
//   };

//   return (
//     <div
//       className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-center space-x-4 mb-4 animate-fade-in"
//     >
//       {/* Smaller Image */}
//       <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm flex-shrink-0"
//       onClick={() => handleProductClick(id)}>
//         <img
//           src={image || ""}
//           alt={name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform"
//           onError={(e) => {
//             e.target.src = "";
//           }}
//         />
//       </div>

//       {/* Compact Content */}
//       <div className="flex-1 space-y-1">
//         <div className="flex justify-between items-start">
//           <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
//             {name} <span className="text-sm text-gray-500">({color})</span>
//           </h3>
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // Prevent navigation when clicking remove
//               onRemove(id, color);
//             }}
//             className="text-orange-800 hover:text-orange-900 transition-colors py-2"
//             aria-label="Remove item"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="flex items-center space-x-2">
//           <p className="text-gray-800 font-semibold text-base py-2">
//             ₹{discountedPrice.toFixed(2)}
//           </p>
//           {discount > 0 && (
//             <>
//               <p className="text-gray-400 line-through text-sm">
//                 ₹{originalPrice.toFixed(2)}
//               </p>
//               <p className="text-green-600 text-xs">({discount}% off)</p>
//             </>
//           )}
//         </div>

//         <div className="flex justify-between items-center py-2">
//           <QuantityControl
//             quantity={quantity}
//             onIncrease={() => onUpdateQuantity(quantity + 1)}
//             onDecrease={() => onUpdateQuantity(quantity - 1)}
//           />
//           <p className="font-semibold text-gray-800 text-base">
//             ₹{(discountedPrice * quantity).toFixed(2)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartItem;


import React from "react";
import { Trash2 } from "lucide-react";
import QuantityControl from "./QuantityControl";
import { useNavigate } from "react-router-dom";

const CartItem = ({
  id,
  name,
  originalPrice,
  latestPrice,
  discount,
  quantity,
  image,
  color,
  onRemove,
  onUpdateQuantity,
}) => {
  const discountedPrice = latestPrice;
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/shop/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex items-start space-x-6 mb-4 animate-fade-in">
      {/* Larger Image - Increased from w-20 to w-32 */}
      <div 
        className="w-32 h-32 rounded-lg overflow-hidden shadow-sm flex-shrink-0 cursor-pointer"
        onClick={() => handleProductClick(id)}
      >
        <img
          src={image || ""}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "";
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full justify-between">
        <div>
          {/* Top Row - Name and Remove Button */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {name} <span className="text-sm text-gray-500">({color})</span>
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id, color);
              }}
              className="text-orange-800 hover:text-orange-900 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Price Information */}
          <div className="flex items-center space-x-3 mt-2">
            <p className="text-gray-800 font-semibold text-lg">
              ₹{discountedPrice.toFixed(2)}
            </p>
            {discount > 0 && (
              <>
                <p className="text-gray-400 line-through text-sm">
                  ₹{originalPrice.toFixed(2)}
                </p>
                <p className="text-green-600 text-sm">({discount}% off)</p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Row - Quantity and Total */}
        <div className="flex justify-between items-center mt-4">
          <QuantityControl
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(quantity + 1)}
            onDecrease={() => onUpdateQuantity(quantity - 1)}
            size="md" // Assuming your QuantityControl supports size props
          />
          <p className="font-semibold text-gray-800 text-lg">
            ₹{(discountedPrice * quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;