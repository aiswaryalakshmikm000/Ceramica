import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "../../features/userAuth/userApiSlice";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../../features/userAuth/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleAuth = () => {
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await googleAuth({
        credential: credentialResponse.credential,
      }).unwrap();
      dispatch(setUserCredentials({ user: result.user }));
      toast.success(result.message || "Google login successful");
      navigate("/");
    } catch (err) {
        toast.error(err?.data?.message || "Google login failed. Please try again.");
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        render={(renderProps) => (
          <button
            type="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled || isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white/80 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <img src="https://www.google.con/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        )}
      />
    </div>
  );
};

export default GoogleAuth;