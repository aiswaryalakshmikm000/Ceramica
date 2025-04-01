import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsUserAuthenticated, selectUserRole } from '../features/auth/userAuthSlice';
import { selectIsAdminAuthenticated, selectAdminRole } from '../features/auth/adminAuthSlice';
import { useCheckAuthQuery } from "../features/auth/userApiSlice";

// export const IsUserLogin = ({ children }) => {
//   const dispatch = useDispatch();

//   const isAuthenticated = useSelector(selectIsUserAuthenticated);
//   const userRole = useSelector(selectUserRole);
//   const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);

//   console.log('--- IsUserLogin ---');
//   console.log('isAuthenticated:', isAuthenticated);
//   console.log('userRole:', userRole);
//   console.log('isAdminAuthenticated:', isAdminAuthenticated);

//   if (!isAuthenticated || userRole !== 'user') {
//     console.log('User not authenticated or wrong role, redirecting to /login');
//     return <Navigate to="/login" />;
//   }
//   if (isAdminAuthenticated) {
//     console.log('Admin authenticated, clearing admin state');
//     dispatch(logoutAdmin());
//   }
//   console.log('User access granted');
//   return children;
// };


export const IsUserLogin = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Fetch auth state directly
  const { data: authData, isLoading, isFetching } = useCheckAuthQuery();

  console.log("--- IsUserLogin ---");
  console.log("Redux - isAuthenticated:", isAuthenticated);
  console.log("Redux - userRole:", userRole);
  console.log("checkAuth - Data:", authData, "isLoading:", isLoading, "isFetching:", isFetching);

  // Wait for checkAuth to resolve
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Use authData if available, otherwise fall back to Redux
  const effectiveAuthenticated = authData?.role === "user" || isAuthenticated;
  const effectiveRole = authData?.role || userRole;

  if (!effectiveAuthenticated || effectiveRole !== "user") {
    console.log("User not authenticated or wrong role, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("User access granted");
  return children;
};


export const IsUserLogout = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const userRole = useSelector(selectUserRole);

  console.log('IsUserLogout - isAuthenticated:', isAuthenticated);
  console.log('IsUserLogout - userRole:', userRole);

  if (isAuthenticated && userRole === 'user') {
    console.log('IsUserLogout - Redirecting to /');
    return <Navigate to="/" />;
  }
  console.log('IsUserLogout - Access granted');
  return children;
};


export const IsAdminLogin = ({ children }) => {
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  const adminRole = useSelector(selectAdminRole);
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);

  console.log('--- IsAdminLogin ---');
  console.log('isAdminAuthenticated:', isAdminAuthenticated);
  console.log('adminRole:', adminRole);
  console.log('isUserAuthenticated:', isUserAuthenticated);

  if (!isAdminAuthenticated || adminRole !== 'admin') {
    console.log('Admin not authenticated or wrong role, redirecting to /admin/login');
    return <Navigate to="/admin/login" />;
  }
  if (isUserAuthenticated) {
    console.log('User authenticated, clearing user state');
    dispatch(logoutUser());
  }
  console.log('Admin access granted');
  return children;
};

export const IsAdminLogout = ({ children }) => {
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  const adminRole = useSelector(selectAdminRole);

  console.log('IsAdminLogout - isAdminAuthenticated:', isAdminAuthenticated);
  console.log('IsAdminLogout - adminRole:', adminRole);

  if (isAdminAuthenticated && adminRole === 'admin') {
    console.log('IsAdminLogout - Redirecting to /admin/dashboard');
    return <Navigate to="/admin/dashboard" />;
  }
  console.log('IsAdminLogout - Access granted');
  return children;
};