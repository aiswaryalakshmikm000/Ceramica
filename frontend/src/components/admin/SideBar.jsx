// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ShoppingBag, Users, Package, Tag, Star, Settings, Percent, Gift } from 'lucide-react';

// const Sidebar = () => {
//   const location = useLocation();

//   // Sidebar navigation items
//   const sidebarItems = [
//     { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
//     { label: 'Products', icon: <Package size={20} />, path: '/admin/products' },
//     { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
//     { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
//     { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
//     { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
//     { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
//     { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
//     { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
//   ];

//   return (
//     <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
//       <div className="p-4 text-2xl font-bold">Ceramic Admin</div>
//       <nav className="mt-6">
//         {sidebarItems.map((item) => (
//           <Link
//             key={item.label}
//             to={item.path}
//             className={`flex items-center p-4 hover:bg-blue-600 transition-colors ${
//               location.pathname === item.path ? 'bg-blue-600' : ''
//             }`}
//           >
//             {item.icon}
//             <span className="ml-3">{item.label}</span>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;



// src/components/admin/SideBar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  Tag, 
  Star, 
  Settings, 
  Percent, 
  Gift,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

const SideBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // State to toggle sidebar

  const sidebarItems = [
    { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
    { label: 'Products', icon: <Package size={20} />, path: '/admin/products' }, // Removed trailing slash
    { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
    { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
    { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to determine if an item should be highlighted
  const isActive = (itemPath) => {
    if (itemPath === '/admin/products') {
      // Highlight "Products" if the path is exactly "/admin/products" or starts with "/admin/products/add" or "/admin/products/edit/"
      return (
        location.pathname === '/admin/products' ||
        location.pathname === '/admin/products/add' ||
        location.pathname.startsWith('/admin/products/edit/')
      );
    }
    // For other items, exact match is sufficient
    return location.pathname === itemPath;
  };

  return (
    <aside 
      className={`bg-white-800 text-gray flex-shrink-0 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header with toggle button */}
      <div className="p-4 flex justify-between items-center">
        {isOpen && <span className="text-2xl font-bold">Ceramic Admin</span>}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center p-4 hover:bg-blue-600 transition-colors ${
              isActive(item.path) ? 'bg-blue-600' : ''
            }`}
            title={item.label} // Tooltip for collapsed state
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;