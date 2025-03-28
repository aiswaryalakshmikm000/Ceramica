import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  isAdminAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.isAdminAuthenticated = true;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

export const selectAdmin = (state) => state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAdminAuthenticated;
export const selectAdminRole = (state) => state.adminAuth.admin?.role || null;