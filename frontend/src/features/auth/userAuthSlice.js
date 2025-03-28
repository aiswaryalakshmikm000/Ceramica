import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserCredentials, logoutUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;

export const selectUser = (state) => state.userAuth.user;
export const selectIsUserAuthenticated = (state) => state.userAuth.isAuthenticated;
export const selectUserRole = (state) => state.userAuth.user?.role || null;