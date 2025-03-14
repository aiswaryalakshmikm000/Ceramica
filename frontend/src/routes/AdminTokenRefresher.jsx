import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAdminAccessToken, logoutAdmin } from "../features/auth/adminAuthSlice";
import { adminApi } from "../services/api/adminApi";

const AdminTokenRefresher = () => {
  const dispatch = useDispatch();
  const [triggerRefreshToken] = adminApi.endpoints.refreshToken.useLazyQuery();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const { data } = await triggerRefreshToken();
        if (data?.adminAccessToken) {
          dispatch(setAdminAccessToken(data.adminAccessToken));
        }
      } catch {
        dispatch(logoutAdmin());
      }
    };

    refreshToken();
  }, [dispatch, triggerRefreshToken]);

  return null;
};

export default AdminTokenRefresher;
