import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutAdmin, setAdminCredentials } from "../../features/auth/adminAuthSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5001/api/admin",
  credentials: "include", // Ensures cookies (tokens) are sent with every request
});

// Custom query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("RTK Query request args:", args); // Log the full request
  
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
      result = await baseQuery(args, api, extraOptions); // Retry the original request
    } else {
      console.log("Refresh token invalid. Logging out admin.");
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
