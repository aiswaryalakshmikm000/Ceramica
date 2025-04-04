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

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">My Account</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={onClose}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="text-sm text-center text-gray-500">
            Ceramica © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;