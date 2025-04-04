import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import userAuthReducer from "../features/userAuth/userAuthSlice";
import adminAuthReducer from "../features/adminAuth/adminAuthSlice";

import { userApi } from "../services/api/userApi";
import { adminApi } from "../services/api/adminApi";

import { adminProductApiSlice } from "../features/adminAuth/adminProductApiSlice";
import { AdminCategoryApiSlice } from "../features/adminAuth/AdminCategoryApiSlice";
import { adminCustomerApiSlice } from "../features/adminAuth/AdminCustomerApiSlice";

import { userProductApiSlice } from "../features/userAuth/userProductApiSlice";
import { userWishlistApiSlice } from "../features/userAuth/userWishlistApiSlice"
import { userCartApiSlice } from "../features/userAuth/userCartApislice";
import { userAddressApiSlice } from "../features/userAuth/userAddressApiSlice"
import { userProfileApiSlice } from "../features/userAuth/userProfileApiSlice"


const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,

    [userProductApiSlice.reducerPath]: userProductApiSlice.reducer,
    [userWishlistApiSlice.reducerPath]: userWishlistApiSlice.reducer,
    [userCartApiSlice.reducerPath]: userCartApiSlice.reducer,
    [userAddressApiSlice.reducerPath]: userAddressApiSlice.reducer,
    [userProfileApiSlice.reducerPath]: userProfileApiSlice.reducer,

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