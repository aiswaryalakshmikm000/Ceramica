// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userAuthReducer from "../features/auth/userAuthSlice";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import userProductReducer from "../features/products/userProductSlice";
import adminProductReducer from "../features/products/adminProductSlice";
import { userApi } from "../services/api/userApi";
import { adminApi } from "../services/api/adminApi";
import { userProductApiSlice } from "../features/products/userProductApislice";
import { adminProductApiSlice } from "../features/products/adminProductApiSlice";
import categoryReducer from '../features/categories/categorySlice';

const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    userProduct: userProductReducer,
    adminProduct: adminProductReducer,
    categories: categoryReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userProductApiSlice.reducerPath]: userProductApiSlice.reducer,
    [adminProductApiSlice.reducerPath]: adminProductApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, adminApi.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

// Enable refetchOnFocus and refetchOnReconnect for RTK Query
setupListeners(store.dispatch);


export default store;