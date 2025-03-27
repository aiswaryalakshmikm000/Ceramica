import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsUserAuthenticated } from '../features/auth/userAuthSlice';
import { selectIsAdminAuthenticated } from '../features/auth/adminAuthSlice';

// User Routes
export const IsUserLogin = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const IsUserLogout = ({ children }) => {
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Admin Routes
export const IsAdminLogin = ({ children }) => {
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);

  // If admin is authenticated, allow access
  if (isAdminAuthenticated) {
    return children;
  }
  if (isUserAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/" />; 
  }
  return <Navigate to="/admin/login" />;
};

export const IsAdminLogout = ({ children }) => {
  const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);
  return isAdminAuthenticated ? <Navigate to="/admin/dashboard" /> : children;
};


