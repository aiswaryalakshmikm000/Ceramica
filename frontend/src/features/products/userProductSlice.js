



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    search: "",
    categoryIds: [],
    minPrice: 0,
    maxPrice: 0,
    sort: "newArrivals",
  },
  wishlist: [],
};

const userProductSlice = createSlice({
  name: "userProduct",
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addToWishlist: (state, action) => {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((id) => id !== action.payload);
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
  },
});

export const { updateFilters, addToWishlist, removeFromWishlist } = userProductSlice.actions;
export default userProductSlice.reducer;
