import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser, setUserCredentials } from "../../features/auth/userAuthSlice";



const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/user",
  credentials: "include", // Automatically include cookies in requests
});

// Custom query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      { url: "/refreshToken", method: "POST" }, 
      api, 
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.success) {
      console.log("Access token refreshed successfully");

      api.dispatch(setUserCredentials({ user: refreshResult.data.user }));
      // Retry the original request after refresh
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh token failed, logging out user");
      api.dispatch(logoutUser());
    }
  }

  return result;
};

// User API instance
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Category"],
  endpoints: () => ({}),
});

