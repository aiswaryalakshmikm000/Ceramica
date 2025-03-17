import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: localStorage.getItem("AdminData") || null, // Holds admin data after login
  isAdminAuthenticated: false, // Admin authentication status flag
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      localStorage.setItem("AdminData",JSON.stringify(action.payload.admin))
      state.admin = action.payload.admin;
      state.isAdminAuthenticated = true;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;
      localStorage.removeItem("AdminData")
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

// Selectors
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAdminAuthenticated;
