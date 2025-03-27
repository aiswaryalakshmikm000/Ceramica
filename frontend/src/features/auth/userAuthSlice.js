import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
  isAuthenticated: false, 
};

// Safely initialize from localStorage
const storedUserData = localStorage.getItem("UserData");
if (storedUserData) {
  try {
    initialState.user = JSON.parse(storedUserData);
    initialState.isAuthenticated = !!initialState.user; 
  } catch (error) {
    console.error("Failed to parse UserData from localStorage:", error);
    localStorage.removeItem("UserData"); 
  }
}

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("UserData", JSON.stringify(action.payload.user));
      console.log("UserData set in localStorage:", localStorage.getItem("UserData"));
    },
    logoutUser: (state) => {
      console.log("Logging out user");
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("UserData");
    },
  },
});

export const { setUserCredentials, logoutUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;

export const selectUser = (state) => state.userAuth.user;
export const selectIsUserAuthenticated = (state) => state.userAuth.isAuthenticated;
export const selectUserRole = (state) => state.userAuth.user?.role || null;

