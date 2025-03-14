// src/features/auth/userAuthSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,             // Holds user data after login
  isAuthenticated: false, // Authentication status flag
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    // Stores the logged-in user's data.
    setUserCredentials: (state, action) => {
      state.user = action.payload.user; 
      state.isAuthenticated = true;
    },
    // Clears the user state when logging out.
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserCredentials, logoutUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;

// Selectors
export const selectUser = (state) => state.userAuth.user;
export const selectIsUserAuthenticated = (state) => state.userAuth.isAuthenticated;
