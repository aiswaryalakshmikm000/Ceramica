import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { useShowProfileQuery } from "../../../features/auth/userApiSlice";
import { toast } from "react-toastify";
import ChangePasswordRequestModal from "./ChangePasswordRequestModal"; // New modal
import OTPEnterModal from "../OTPEnterModal";
import ResetPasswordModal from "../ResetPasswordModal";
import { useForgetPasswordMutation, useResetPasswordMutation } from "../../../features/auth/userApiSlice";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading,
    error,
  } = useShowProfileQuery(id, { skip: !id });

  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const [showOTPModal, setShowOTPModal] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [email, setEmail] = React.useState("");

  useEffect(() => {
    if (userData) {
      setEmail(userData.email); 
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load profile data");
    return <div className="text-center text-red-500">Error loading profile</div>;
  }

  const user = userData || {
    name: "Guest",
    email: "N/A",
    phone: "N/A",
    joinedDate: "N/A",
    images: "",
  };

  const handleEditProfile = () => {
    navigate(`/profile/edit/${id}`);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleSendOTP = async (emailInput) => {
    try {
      await forgetPassword({ email: emailInput }).unwrap();
      setEmail(emailInput);
      setShowChangePasswordModal(false);
      setShowOTPModal(true);
      toast.success("OTP sent to your email successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleOTPVerifySuccess = (response) => {
    if (response.success) {
      toast.success(response.message || "OTP verified successfully");
      setShowOTPModal(false);
      setShowResetModal(true);
    }
  };

  const handleResetSuccess = (response) => {
    if (response.success) {
      toast.success("Password reset successfully!");
      setShowResetModal(false);
    }
  };

  return (
    <div className="mx-20 px-4 my-20">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 pr-0 md:pr-6 mb-8 md:mb-0">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile Details</h2>
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                  <User className="mr-4 text-[#a96446]" size={27} />
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                  <Mail className="mr-4 text-[#a96446]" size={27} />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-gray-800">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                  <Phone className="mr-4 text-[#a96446]" size={27} />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-800">{user.phone || "Not provided"}</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                  <Calendar className="mr-4 text-[#a96446]" size={27} />
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium text-gray-800">
                      {user.joinedDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px bg-gray-200 mx-4" />
            <div className="flex-1 md:pl-6 flex flex-col items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md group-hover:border-indigo-200 transition-all duration-300">
                    <img
                      src={user.images}
                      alt={user.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => (e.target.src = "")}
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mt-6 text-center bg-gradient-to-r from-orange-800 to-gray-900 bg-clip-text text-transparent">
                  {user.name}
                </h2>
              </div>
              <div className="mt-8 w-full flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleEditProfile}
                  className="flex-1 bg-orange-800/90 text-white py-3 rounded-lg hover:bg-orange-800 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-orange-800/90 text-white py-3 rounded-lg hover:bg-orange-800 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordRequestModal
        isOpen={showChangePasswordModal}
        closeModal={() => setShowChangePasswordModal(false)}
        email={email}
        onSendOTP={handleSendOTP}
      />

      <OTPEnterModal
        isOpen={showOTPModal}
        closeModal={() => setShowOTPModal(false)}
        email={email}
        onVerifySuccess={handleOTPVerifySuccess}
        flow="passwordChange"
      />

      <ResetPasswordModal
        isOpen={showResetModal}
        closeModal={() => setShowResetModal(false)}
        email={email}
        onResetSuccess={handleResetSuccess}
        resetPasswordMutation={resetPassword}
      />
    </div>
  );
};

export default Profile;