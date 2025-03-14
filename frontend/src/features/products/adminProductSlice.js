import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null, // For editing
  status: "idle",
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  selectProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setStatus,
  setError,
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
