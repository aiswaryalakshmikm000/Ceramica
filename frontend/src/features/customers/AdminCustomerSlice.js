import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,         // Current page for pagination
  limit: 10,              // Number of customers per page
  searchTerm: "",         // Search term for filtering customers
  selectedCustomerId: null, // ID of a selected customer (optional UI feature)
  loading: false,         // General loading state for manual control
  error: null,            // General error state for manual control
};

const AdminCustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // Set current page
    setCurrentPage: (state, action) => {
      state.currentPage = Math.max(1, action.payload); // Ensure page is at least 1
    },

    // Set items per page
    setLimit: (state, action) => {
      state.limit = Math.max(1, action.payload); // Ensure limit is at least 1
    },

    // Set search term and reset page to 1
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page on new search
    },

    // Set selected customer ID (e.g., for detailed view or modal)
    setSelectedCustomerId: (state, action) => {
      state.selectedCustomerId = action.payload;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Reset customer state to initial values
    resetCustomerState: () => initialState,
  },
});

// Export actions
export const {
  setCurrentPage,
  setLimit,
  setSearchTerm,
  setSelectedCustomerId,
  setLoading,
  setError,
  resetCustomerState,
} = AdminCustomerSlice.actions;

// Export reducer
export default AdminCustomerSlice.reducer;