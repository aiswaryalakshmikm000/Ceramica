import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { useSendOTPMutation, useForgetPasswordMutation } from "../../../features/userAuth/userApiSlice";
import { useUpdateProfileMutation, useShowProfileQuery } from "../../../features/userAuth/userProfileApiSlice";
import OTPEnterModal from "../OTPEnterModal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../features/userAuth/userAuthSlice";
import Breadcrumbs from "../../common/BreadCrumbs";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: userData, isLoading: isProfileLoading } = useShowProfileQuery(id, { skip: !id });
  const [sendOTP] = useSendOTPMutation();
  const [forgetPassword] = useForgetPasswordMutation();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    imagePreview: null,
  });
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpFlow, setOtpFlow] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if user is Google-authenticated
  const isGoogleUser = userData?.googleId !== undefined && userData?.googleId !== null;

  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        image: null,
        imagePreview: userData.images || null,
      });
      setOtpVerified(false);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent email changes for Google users
    if (name === "email" && isGoogleUser) return;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && value !== userData?.email) {
      setOtpVerified(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const isEmailValid = (email) => {
    return email.match(/@gmail\.com$/);
  };

  const handleSendOtp = async (flow) => {
    if (isGoogleUser) {
      toast.error("Email cannot be changed for Google-authenticated users");
      return;
    }
    setIsVerifying(true);
    try {
      if (flow === "emailChange") {
        await sendOTP({ email: formValues.email }).unwrap();
        toast.success("OTP sent to your email");
      } else if (flow === "passwordChange") {
        await forgetPassword({ email: formValues.email }).unwrap();
        toast.success("OTP sent to your email for password reset");
      }
      setOtpFlow(flow);
      setIsOtpModalOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifySuccess = (response) => {
    toast.success(response.message || "OTP verified successfully");
    setOtpVerified(true);
    setIsOtpModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.name || !formValues.email || !formValues.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!isEmailValid(formValues.email)) {
      toast.error("Only Gmail addresses are allowed");
      return;
    }
    if (!formValues.phone.match(/^[0-9]{10}$/)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (formValues.email !== userData?.email && !otpVerified && !isGoogleUser) {
      toast.error("Please verify OTP to change email");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("email", formValues.email);
      formData.append("phone", formValues.phone);
      if (formValues.image instanceof File) {
        formData.append("image", formValues.image);
      }

      const result = await updateProfile({ id, formData }).unwrap();
      dispatch(updateUser({
        name: result.updatedUser.name,
        email: result.updatedUser.email,
        phone: result.updatedUser.phone,
        images: result.updatedUser.images,
      }));
      toast.success(result.message || "Profile updated successfully");
      navigate(`/profile/${id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  const emailChanged = formValues.email !== userData?.email;

  // Define breadcrumb items for the Edit Profile page
  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Profile", href: `/profile/${id}` },
    { label: "Edit Profile", href: `/profile/edit/${id}` },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-semibol sm:mb-6 text-gray-800">Edit Profile</h2>
          <Breadcrumbs items={breadcrumbItems} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 pr-0 lg:pr-6 mb-6 lg:mb-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <User className="mr-3 sm:mr-4 text-[#a96446]" size={24} />
                    <div className="w-full">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Mail className="mr-3 sm:mr-4 text-[#a96446]" size={24} />
                    <div className="w-full">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                      <div className="relative w-full">
                        <input
                          type="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          disabled={isGoogleUser}
                          className={`w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-3 sm:px-4 py-2 sm:py-3 rounded-lg pr-20 sm:pr-24 text-sm sm:text-base ${
                            isGoogleUser ? "cursor-not-allowed opacity-70" : ""
                          }`}
                          placeholder="Enter your email"
                        />
                        {emailChanged && !isGoogleUser && (
                          <span
                            onClick={() => isEmailValid(formValues.email) && !isVerifying ? handleSendOtp("emailChange") : null}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                              isEmailValid(formValues.email) && !isVerifying
                                ? "text-orange-600 hover:text-orange-700 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {isVerifying ? "Verifying..." : "Verify Email"}
                          </span>
                        )}
                        {isGoogleUser && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-gray-500">
                            Google Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Phone className="mr-3 sm:mr-4 text-[#a96446]" size={24} />
                    <div className="w-full">
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-px bg-gray-200 mx-4" />
              <div className="flex-1 lg:pl-6 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-full overflow-hidden border-4 border-indigo-100">
                      <img
                        src={formValues.imagePreview || "https://via.placeholder.com/150"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 sm:p-3 shadow-lg cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <span className="text-[#a96446] text-xs sm:text-sm">Upload</span>
                    </label>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-4 lg:mt-6 text-center">
                    {formValues.name || "Edit Your Profile"}
                  </h2>
                </div>
                <div className="mt-6 lg:mt-8 w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    disabled={isLoading || (emailChanged && !otpVerified && !isGoogleUser)}
                    className={`flex-1 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                      isLoading || (emailChanged && !otpVerified && !isGoogleUser) ? "bg-orange-800/90 cursor-not-allowed" : "bg-orange-800/90 hover:bg-orange-700"
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="flex-1 bg-gray-600/30 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <OTPEnterModal
        isOpen={isOtpModalOpen}
        closeModal={() => setIsOtpModalOpen(false)}
        email={formValues.email}
        onVerifySuccess={handleVerifySuccess}
        flow={otpFlow}
      />
    </div>
  );
};

export default EditProfile;