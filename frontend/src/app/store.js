// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userAuthReducer from "../features/auth/userAuthSlice";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import { userApi } from "../services/api/userApi";
import { adminApi } from "../services/api/adminApi";
import { userProductApiSlice } from "../features/products/userProductApislice";
import { adminProductApiSlice } from "../features/products/adminProductApiSlice";
import { AdminCategoryApiSlice } from "../features/categories/AdminCategoryApiSlice";
import { adminCustomerApiSlice } from "../features/customers/AdminCustomerApiSlice";
import customerReducer from "../features/customers/AdminCustomerSlice"

const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    customers: customerReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [userProductApiSlice.reducerPath]: userProductApiSlice.reducer,
    [adminProductApiSlice.reducerPath]: adminProductApiSlice.reducer,
    [AdminCategoryApiSlice.reducerPath]: AdminCategoryApiSlice.reducer,
    [adminCustomerApiSlice.reducerPath]: adminCustomerApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, adminApi.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

setupListeners(store.dispatch);


export default store;