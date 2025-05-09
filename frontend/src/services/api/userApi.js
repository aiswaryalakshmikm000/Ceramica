import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser, setUserCredentials } from "../../features/userAuth/userAuthSlice";
import { toast } from "react-toastify";


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_USER_URL,
  credentials: "include", 
});

// Custom query with token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if(result.error && result.error.status === 403) {
    try {
      const blockResult = await baseQuery(
        { url: "/logout", method: "POST" }, 
        api, 
        extraOptions
      );
      if(blockResult.success){
        api.dispatch(logoutUser())
        toast.error('Your account was blocked by Admin, Contact support');
      }
    } catch (error) {
      console.log('Error:', error)
      toast.error(error);
    }
  }
  
  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Attempting to refresh...");

    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      { url: "/refreshToken", method: "POST" }, 
      api, 
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.success) {
      console.log("User Access token refreshed successfully");
      console.log("Refresh result:", refreshResult.data);

      api.dispatch(setUserCredentials({ user: refreshResult.data.user }));
      // Retry the original request after refresh
      result = await baseQuery(args, api, extraOptions);
    } else {
      const isUserAuthenticated = api.getState().userAuth.isAuthenticated;
      if (isUserAuthenticated) {
        toast.error('User Session expired. Please log in again.');
      }
      api.dispatch(logoutUser());
    }
  }

  return result;
};

// User API instance
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Category", "Cart", "Wishlist"],
  endpoints: () => ({}),
});

