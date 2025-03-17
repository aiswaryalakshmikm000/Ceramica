import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Users, Package, Tag, Star, Settings, Percent, Gift } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // Sidebar navigation items
  const sidebarItems = [
    { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
    { label: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
    { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
    { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4 text-2xl font-bold">Ceramic Admin</div>
      <nav className="mt-6">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center p-4 hover:bg-blue-600 transition-colors ${
              location.pathname === item.path ? 'bg-blue-600' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;