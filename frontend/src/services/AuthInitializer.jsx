import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useCheckAuthQuery as useUserCheckAuthQuery } from '../features/userAuth/userApiSlice';
import { useCheckAuthQuery as useAdminCheckAuthQuery } from '../features/adminAuth/adminApiSlice';
import { setUserCredentials, logoutUser } from '../features/userAuth/userAuthSlice';
import { setAdminCredentials, logoutAdmin } from '../features/adminAuth/adminAuthSlice';
import { toast } from 'react-toastify';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const userCheck = useUserCheckAuthQuery(undefined, { skip: isAdminRoute });
  const adminCheck = useAdminCheckAuthQuery(undefined, { skip: !isAdminRoute });

  const { data: userData, isSuccess: userSuccess, error: userError } = userCheck;
  const { data: adminData, isSuccess: adminSuccess, error: adminError } = adminCheck;

  useEffect(() => {
    if (userSuccess && userData) {
      if (userData.role === 'user') {
        dispatch(setUserCredentials({ user: userData }));
      } else {
        dispatch(logoutUser());
      }
    }
    if (userError) {
      if (userError.status === 403) {
        toast.error('Your account is blocked. Please contact support.');
        dispatch(logoutUser());
      }
    }
  }, [userData, userSuccess, userError, dispatch]);

  useEffect(() => {
    if (adminSuccess && adminData) {
      if (adminData.role === 'admin') {
        dispatch(setAdminCredentials({ admin: adminData }));
      } else {
        dispatch(logoutAdmin());
      }
    }
  }, [adminData, adminSuccess, dispatch]);

  return children;
};

export default AuthInitializer;