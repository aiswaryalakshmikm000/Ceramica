import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutAdmin, setAdminCredentials } from "../../features/adminAuth/adminAuthSlice";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_ADMIN_URL,
  credentials: "include", 
});

// Custom query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    
    console.log("Access token expired. Attempting to refresh...");

    const refreshResult = await baseQuery(
      { url: "/refreshToken", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data?.success) {
      console.log("Access token refreshed. Retrying request...");
      api.dispatch(setAdminCredentials({ admin: refreshResult.data.admin }));

      // Retry the original request after refresh
      result = await baseQuery(args, api, extraOptions); 
    } else {
      const isAdminAuthenticated = api.getState().adminAuth.isAdminAuthenticated;
      if (isAdminAuthenticated) {
        toast.error('Admin Session expired. Please log in again.');
      }
      api.dispatch(logoutAdmin());
    }
  }

  return result;
};

// Admin API instance
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Category", "Order"],
  endpoints: () => ({}),
});
