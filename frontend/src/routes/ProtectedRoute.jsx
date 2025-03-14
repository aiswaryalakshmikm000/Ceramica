// // src/routes/ProtectedRoute.jsx
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAppSelector } from '../app/hooks';
// import { selectIsAuthenticated } from '../features/auth/userAuthSlice';
// // src/routes/AdminRoute.jsx
// import { selectIsAdmin } from '../features/auth/userAuthSlice';

// export const ProtectedRoute = () => {
//   const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };



// export const AdminRoute = () => {
//   const isAdmin = useAppSelector(selectIsAdmin);
  
//   return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

// // src/routes/index.jsx
// import { createBrowserRouter } from 'react-router-dom';
// // import { ProtectedRoute } from './ProtectedRoute';
// // import { AdminRoute } from './AdminRoute';

// // User Pages
// import HomePage from '../pages/user/HomePage';
// import ShopPage from '../pages/user/ShopPage';
// import ProductDetailPage from '../pages/user/ProductDetailPage';
// import AboutPage from '../pages/user/AboutPage';
// import LoginPage from '../pages/user/LoginPage';
// import RegisterPage from '../pages/user/RegisterPage';
// import ForgotPasswordPage from '../pages/user/ForgotPasswordPage';
// import UserProfilePage from '../pages/user/UserProfilePage';
// import UserOrdersPage from '../pages/user/UserOrdersPage';

// // Admin Pages
// import AdminDashboard from '../pages/admin/Dashboard';
// import AdminProducts from '../pages/admin/Products';
// import AdminCategories from '../pages/admin/Categories';
// import AdminOrders from '../pages/admin/Orders';
// import AdminCustomers from '../pages/admin/Customers';
// import AdminReviews from '../pages/admin/Reviews';
// import AdminSettings from '../pages/admin/Settings';
// import AdminOffers from '../pages/admin/Offers';
// import AdminCoupons from '../pages/admin/Coupons';

// // Layouts
// import UserLayout from '../components/layout/UserLayout';
// import AdminLayout from '../components/layout/AdminLayout';
// import ErrorPage from '../pages/ErrorPage';
// import UnauthorizedPage from '../pages/UnauthorizedPage';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <UserLayout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: 'shop', element: <ShopPage /> },
//       { path: 'product/:id', element: <ProductDetailPage /> },
//       { path: 'about', element: <AboutPage /> },
//       { path: 'login', element: <LoginPage /> },
//       { path: 'register', element: <RegisterPage /> },
//       { path: 'forgot-password', element: <ForgotPasswordPage /> },
//       { path: 'unauthorized', element: <UnauthorizedPage /> },
//       {
//         element: <ProtectedRoute />,
//         children: [
//           { path: 'profile', element: <UserProfilePage /> },
//           { path: 'orders', element: <UserOrdersPage /> },
//         ],
//       },
//     ],
//   },
//   {
//     path: '/admin',
//     element: <AdminLayout />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         element: <AdminRoute />,
//         children: [
//           { index: true, element: <AdminDashboard /> },
//           { path: 'products', element: <AdminProducts /> },
//           { path: 'categories', element: <AdminCategories /> },
//           { path: 'orders', element: <AdminOrders /> },
//           { path: 'customers', element: <AdminCustomers /> },
//           { path: 'reviews', element: <AdminReviews /> },
//           { path: 'settings', element: <AdminSettings /> },
//           { path: 'offers', element: <AdminOffers /> },
//           { path: 'coupons', element: <AdminCoupons /> },
//         ],
//       },
//     ],
//   },
// ]);

import React from 'react'

const ProtectedRoute = () => {
  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute
