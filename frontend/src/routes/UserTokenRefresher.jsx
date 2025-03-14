import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserAccessToken, logoutUser } from "../features/auth/userAuthSlice";
import { userApi } from "../services/api/userApi";

const UserTokenRefresher = () => {
  const dispatch = useDispatch();
  const [triggerRefreshToken] = userApi.endpoints.refreshToken.useLazyQuery();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const { data } = await triggerRefreshToken();
        if (data?.accessToken) {
          dispatch(setUserAccessToken(data.accessToken));
        }
      } catch {
        dispatch(logoutUser());
      }
    };

    refreshToken();
  }, [dispatch, triggerRefreshToken]);

  return null;
};

export default UserTokenRefresher;
