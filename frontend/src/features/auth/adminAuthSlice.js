import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, 
  isAdminAuthenticated: false,
};

const storedAdminData = localStorage.getItem("AdminData");
if (storedAdminData) {
  try {
    initialState.admin = JSON.parse(storedAdminData);
    initialState.isAdminAuthenticated = !!initialState.admin;
  } catch (error) {
    console.error("Failed to parse AdminData from localStorage:", error);
    localStorage.removeItem("AdminData"); 
  }
}

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.isAdminAuthenticated = true;
      localStorage.setItem("AdminData", JSON.stringify(action.payload.admin));
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.isAdminAuthenticated = false;
      localStorage.removeItem("AdminData");
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

export const selectAdmin = (state) => state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAdminAuthenticated;
export const selectAdminRole = (state) => state.adminAuth.admin?.role || null;


