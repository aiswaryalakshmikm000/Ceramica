// import { createSlice } from '@reduxjs/toolkit';

// const categorySlice = createSlice({
//   name: 'categories',
//   initialState: {
//     categories: [],
//     currentCategory: null,
//     loading: false,
//     adding: false,
//     updating: false,
//     error: null,
//   },
//   reducers: {
//     setCategories: (state, action) => {
//       state.categories = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setCurrentCategory: (state, action) => {
//       state.currentCategory = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setLoading: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     setAdding: (state, action) => {
//       state.adding = action.payload;
//       state.error = null;
//     },
//     setUpdating: (state, action) => {
//       state.updating = action.payload;
//       state.error = null;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//       state.adding = false;
//       state.updating = false;
//     },
//   },
// });

// export const { 
//   setCategories, 
//   setCurrentCategory,
//   setLoading, 
//   setAdding,
//   setUpdating,
//   setError 
// } = categorySlice.actions;
// export default categorySlice.reducer;