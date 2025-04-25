import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import userAuthReducer from "../features/userAuth/userAuthSlice";
import adminAuthReducer from "../features/adminAuth/adminAuthSlice";

import { userApi } from "../services/api/userApi";
import { adminApi } from "../services/api/adminApi";

const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, adminApi.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

setupListeners(store.dispatch);

export default store;
