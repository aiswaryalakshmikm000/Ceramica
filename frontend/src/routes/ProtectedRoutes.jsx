import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsUserAuthenticated, selectUserRole } from '../features/userAuth/userAuthSlice';
import { selectIsAdminAuthenticated, selectAdminRole } from '../features/adminAuth/adminAuthSlice';
import { useCheckAuthQuery } from "../features/userAuth/userApiSlice";

export const IsUserLogin = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Fetch auth state directly
  const { data: authData, isLoading, isFetching } = useCheckAuthQuery();

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
    return <Navigate to="/login" replace />;
  }

  return children;
};


export const IsUserLogout = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const userRole = useSelector(selectUserRole);

  if (isAuthenticated && userRole === 'user') {
    return <Navigate to="/" />;
  }
  return children;
};


export const IsAdminLogin = ({ children }) => {
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  const adminRole = useSelector(selectAdminRole);
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);

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

  if (isAdminAuthenticated && adminRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  console.log('IsAdminLogout - Access granted');
  return children;
};