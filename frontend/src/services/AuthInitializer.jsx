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

  console.log('--- AuthInitializer ---');
  console.log('Path:', location.pathname);
  console.log('isAdminRoute:', isAdminRoute);
  console.log('User Check - Data:', userData, 'Success:', userSuccess, 'Error:', userError);
  console.log('Admin Check - Data:', adminData, 'Success:', adminSuccess, 'Error:', adminError);

  useEffect(() => {
    if (userSuccess && userData) {
      console.log('User Success - Role:', userData.role);
      if (userData.role === 'user') {
        dispatch(setUserCredentials({ user: userData }));
      } else {
        console.log('User role mismatch, logging out');
        dispatch(logoutUser());
      }
    }
    if (userError) {
      console.log('User Error:', userError);
      if (userError.status === 403) {
        toast.error('Your account is blocked. Please contact support.');
        dispatch(logoutUser());
      }
    }
  }, [userData, userSuccess, userError, dispatch]);

  useEffect(() => {
    if (adminSuccess && adminData) {
      console.log('Admin Success - Role:', adminData.role);
      if (adminData.role === 'admin') {
        dispatch(setAdminCredentials({ admin: adminData }));
      } else {
        console.log('Admin role mismatch, logging out');
        dispatch(logoutAdmin());
      }
    }
  }, [adminData, adminSuccess, dispatch]);

  return children;
};

export default AuthInitializer;