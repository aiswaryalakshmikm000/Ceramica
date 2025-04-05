// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ShoppingBag, 
//   Users, 
//   Package, 
//   Tag, 
//   Star, 
//   Settings, 
//   Percent, 
//   Gift,
//   ChevronLeft,
//   ChevronRight,
//   LogOut
// } from "lucide-react";
// import { useDispatch } from 'react-redux';
// import { logoutAdmin } from '../../features/adminAuth/adminAuthSlice';
// import { useLogoutMutation } from '../../features/adminAuth/adminApiSlice';
// import Modal from '../common/Modal';

// const SideBar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isOpen, setIsOpen] = useState(true);
//   const [logout] = useLogoutMutation();
//   const [isModalOpen, setIsModalOpen] = useState(false); 

//   const sidebarItems = [
//     { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
//     { label: 'Products', icon: <Package size={20} />, path: '/admin/products' },
//     { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
//     { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
//     { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
//     { label: 'Wallet', icon: <Tag size={20} />, path: '/admin/wallet' },
//     { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
//     { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
//     { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
//     { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
//     { 
//       label: 'Logout', 
//       icon: <LogOut size={20} />, 
//       action: () => setIsModalOpen(true) 
//     }
//   ];

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const isActive = (itemPath) => {
//     if (itemPath === '/admin/products') {
//       return (
//         location.pathname === '/admin/products' ||
//         location.pathname === '/admin/products/add' ||
//         location.pathname.startsWith('/admin/products/edit/')
//       );
//     }
//     return location.pathname === itemPath;
//   };

//   const handleConfirmLogout = async () => {
//     try {
//       await logout().unwrap();
//       dispatch(logoutAdmin());
//       navigate('/admin/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <aside 
//       className={`bg-white-500 text-black-200 flex-shrink-0 transition-all duration-300 flex flex-col h-full ${
//         isOpen ? 'w-64' : 'w-16'
//       }`}
//     >
//       {/* Header with toggle button */}
//       <div className="p-4 flex justify-between items-center">
//         {isOpen && <span className="text-2xl font-bold">Ceramic Admin</span>}
//         <button 
//           onClick={toggleSidebar}
//           className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
//         >
//           {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-6 flex-1">
//         {sidebarItems.map((item) => (
//           item.path ? (
//             <Link
//               key={item.label}
//               to={item.path}
//               className={`flex items-center p-4 hover:bg-blue-600 transition-colors ${
//                 isActive(item.path) ? 'bg-blue-600' : ''
//               }`}
//               title={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {isOpen && <span className="ml-3">{item.label}</span>}
//             </Link>
//           ) : (
//             <button
//               key={item.label}
//               onClick={item.action}
//               className={`flex items-center p-4 w-full hover:bg-blue-600 transition-colors`}
//               title={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {isOpen && <span className="ml-3">{item.label}</span>}
//             </button>
//           )
//         ))}
//       </nav>

//       {/* Logout Confirmation Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmLogout}
//         title="Confirm Logout"
//         message="Are you sure you want to log out of the admin panel?"
//       />
//     </aside>
//   );
// };

// export default SideBar;

// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ShoppingBag, 
//   Users, 
//   Package, 
//   Tag, 
//   Star, 
//   Settings, 
//   Percent, 
//   Gift,
//   ChevronLeft,
//   ChevronRight,
//   LogOut,
//   Wallet
// } from "lucide-react";
// import Modal from '../common/Modal';

// const SideBar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false); 

//   // Mock functions for demonstration - replace with actual Redux implementations
//   const dispatch = () => console.log('Dispatch called');
//   const logout = () => Promise.resolve();
//   const logoutAdmin = () => ({ type: 'LOGOUT_ADMIN' });

//   const sidebarItems = [
//     { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
//     { label: 'Products', icon: <Package size={20} />, path: '/admin/products' },
//     { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
//     { label: 'Wallet', icon: <Wallet size={20} />, path: '/admin/wallet' },
//     { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
//     { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
//     { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
//     { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
//     { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
//     { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
//     { 
//       label: 'Logout', 
//       icon: <LogOut size={20} />, 
//       action: () => setIsModalOpen(true) 
//     }
//   ];

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const isActive = (itemPath) => {
//     if (itemPath === '/admin/products') {
//       return (
//         location.pathname === '/admin/products' ||
//         location.pathname === '/admin/products/add' ||
//         location.pathname.startsWith('/admin/products/edit/')
//       );
//     }
//     return location.pathname === itemPath;
//   };

//   const handleConfirmLogout = async () => {
//     try {
//       await logout();
//       dispatch(logoutAdmin());
//       navigate('/admin/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <aside 
//       className={`bg-white shadow-md flex-shrink-0 transition-all duration-300 flex flex-col h-full border-r ${
//         isOpen ? 'w-64' : 'w-16'
//       }`}
//     >
//       {/* Header with toggle button */}
//       <div className="p-4 flex justify-between items-center border-b">
//         {isOpen && (
//           <div className="flex items-center gap-2">
//             <div className="h-8 w-8 bg-ceramic-blue rounded-md flex items-center justify-center">
//               <span className="text-white font-bold text-lg">C</span>
//             </div>
//             <span className="text-xl font-bold text-ceramic-blue">Ceramic</span>
//           </div>
//         )}
//         <button 
//           onClick={toggleSidebar}
//           className="p-1 rounded-full hover:bg-ceramic-gray-light focus:outline-none text-ceramic-gray-dark"
//         >
//           {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-2 flex-1 overflow-y-auto">
//         {sidebarItems.map((item) => (
//           item.path ? (
//             <Link
//               key={item.label}
//               to={item.path}
//               className={`flex items-center px-4 py-3 hover:bg-ceramic-blue-50 transition-colors ${
//                 isActive(item.path) 
//                   ? 'bg-ceramic-blue-50 text-ceramic-blue border-r-4 border-ceramic-blue' 
//                   : 'text-ceramic-gray-text'
//               }`}
//               title={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
//             </Link>
//           ) : (
//             <button
//               key={item.label}
//               onClick={item.action}
//               className={`flex items-center px-4 py-3 w-full hover:bg-ceramic-blue-50 transition-colors text-ceramic-gray-text`}
//               title={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
//             </button>
//           )
//         ))}
//       </nav>

//       {/* Logout Confirmation Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onConfirm={handleConfirmLogout}
//         title="Confirm Logout"
//         message="Are you sure you want to log out of the admin panel?"
//       />
//     </aside>
//   );
// };

// export default SideBar;



import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  LogOut,
  Wallet,
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../features/adminAuth/adminAuthSlice';
import { useLogoutMutation } from '../../features/adminAuth/adminApiSlice';
import Modal from '../common/Modal';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [logout] = useLogoutMutation();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const sidebarItems = [
    { label: 'Dashboard', icon: <ShoppingBag size={20} />, path: '/admin/dashboard' },
    { label: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { label: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { label: 'Categories', icon: <Tag size={20} />, path: '/admin/categories' },
    { label: 'Wallet', icon: <Wallet size={20} />, path: '/admin/wallet' },
    { label: 'Product Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { label: 'Offers', icon: <Gift size={20} />, path: '/admin/offers' },
    { label: 'Coupons', icon: <Percent size={20} />, path: '/admin/coupons' },
    { 
      label: 'Logout', 
      icon: <LogOut size={20} />, 
      action: () => setIsModalOpen(true) 
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (itemPath) => {
    if (itemPath === '/admin/products') {
      return (
        location.pathname === '/admin/products' ||
        location.pathname === '/admin/products/add' ||
        location.pathname.startsWith('/admin/products/edit/')
      );
    }
    return location.pathname === itemPath;
  };

  const handleConfirmLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAdmin());
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <aside 
      className={`bg-white shadow-md flex-shrink-0 transition-all duration-300 flex flex-col h-full border-r ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header with toggle button */}
      <div className="p-4 flex justify-between items-center border-b">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-ceramic-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-ceramic-blue">Ceramic</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-ceramic-gray-light focus:outline-none text-ceramic-gray-dark"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-4 py-3 hover:bg-ceramic-blue-50 transition-colors ${
                isActive(item.path) 
                  ? 'bg-ceramic-blue-50 text-ceramic-blue border-r-4 border-ceramic-blue' 
                  : 'text-ceramic-gray-text'
              }`}
              title={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ) : (
            <button
              key={item.label}
              onClick={item.action}
              className={`flex items-center px-4 py-3 w-full hover:bg-ceramic-blue-50 transition-colors text-ceramic-gray-text`}
              title={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          )
        ))}
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin panel?"
      />
    </aside>
  );
};

export default SideBar;