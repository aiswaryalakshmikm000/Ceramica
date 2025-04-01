// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { User, Mail, Phone } from "lucide-react";
// import { toast } from "react-toastify";
// import { useUpdateProfileMutation, useShowProfileQuery } from "../../../features/auth/userApiSlice";

// const EditProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [updateProfile, { isLoading }] = useUpdateProfileMutation();
//   const { data: userData, isLoading: isProfileLoading } = useShowProfileQuery(id, { skip: !id });

//   // State for form fields and image preview
//   const [formValues, setFormValues] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     image: null,
//     imagePreview: null, 
//   });

//   // Pre-populate form with user data
//   useEffect(() => {
//     if (userData) {
//       setFormValues({
//         name: userData.name || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         image: null, 
//         imagePreview: userData.images || null, // Existing image URL
//       });
//     }
//   }, [userData]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle image change and preview
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormValues((prev) => ({
//         ...prev,
//         image: file,
//         imagePreview: URL.createObjectURL(file), // Temporary preview
//       }));
//     }
//   };

//   // Custom handleSubmit function
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation (you can expand this)
//     if (!formValues.name || !formValues.email || !formValues.phone) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
//     if (!formValues.email.match(/@gmail\.com$/)) {
//       toast.error("Only Gmail addresses are allowed");
//       return;
//     }
//     if (!formValues.phone.match(/^[0-9]{10}$/)) {
//       toast.error("Phone number must be exactly 10 digits");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", formValues.name.trim());
//       formData.append("email", formValues.email);
//       formData.append("phone", formValues.phone);
//       if (formValues.image instanceof File) {
//         formData.append("images", formValues.image); // Matches backend multer field
//       }

//       // Log FormData for debugging
//       console.log("FormData being sent:");
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}:`, value);
//       }

//       const result = await updateProfile({ id, formData: formData }).unwrap();
//       toast.success(result.message || "Profile updated successfully");
//       navigate(`/profile/${id}`);
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed to update profile");
//       console.error("Submission error:", err);
//     }
//   };

//   if (isProfileLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-16 h-16 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-20 px-4 my-20">
//       <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//         <div className="p-8">
//           <form onSubmit={handleSubmit} encType="multipart/form-data">
//             <div className="flex flex-col md:flex-row">
//               <div className="flex-1 pr-0 md:pr-6 mb-8 md:mb-0">
//                 <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
//                 <div className="space-y-6">
//                   <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                     <User className="mr-4 text-[#a96446]" size={27} />
//                     <div className="w-full">
//                       <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formValues.name}
//                         onChange={handleInputChange}
//                         className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg border-gray-300 focus:outline-none focus:border-indigo-600"
//                         placeholder="Enter your name"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                     <Mail className="mr-4 text-[#a96446]" size={27} />
//                     <div className="w-full">
//                       <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formValues.email}
//                         onChange={handleInputChange}
//                         className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg border-gray-300 focus:outline-none focus:border-indigo-600"
//                         placeholder="Enter your email"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex items-center p-4 bg-gray-50 rounded-lg">
//                     <Phone className="mr-4 text-[#a96446]" size={27} />
//                     <div className="w-full">
//                       <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
//                       <input
//                         type="text"
//                         name="phone"
//                         value={formValues.phone}
//                         onChange={handleInputChange}
//                         className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg border-gray-300 focus:outline-none focus:border-indigo-600"
//                         placeholder="Enter your phone number"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="hidden md:block w-px bg-gray-200 mx-4" />
//               <div className="flex-1 md:pl-6 flex flex-col items-center justify-between">
//                 <div className="flex flex-col items-center">
//                   <div className="relative group">
//                     <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md group-hover:border-indigo-200 transition-all duration-300">
//                       <img
//                         src={formValues.imagePreview || "https://via.placeholder.com/150"}
//                         alt="Profile Preview"
//                         className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
//                       />
//                     </div>
//                     <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100 cursor-pointer">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                       <span className="text-[#a96446]">Upload</span>
//                     </label>
//                   </div>
//                   <h2 className="text-3xl font-bold mt-6 text-center bg-gradient-to-r from-orange-700 to-gray-900 bg-clip-text text-transparent">
//                     {formValues.name || "Edit Your Profile"}
//                   </h2>
//                 </div>
//                 <div className="mt-8 w-full flex flex-col md:flex-row gap-4">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`flex-1 text-white py-3 rounded-lg ${
//                       isLoading ? "bg-orange-700 cursor-not-allowed" : "bg-orange-800/90 hover:bg-gray-400"
//                     } transition-colors`}
//                   >
//                     {isLoading ? "Saving..." : "Save Changes"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => navigate(`/profile/${id}`)}
//                     className="flex-1 bg-gray-600/30 text-white py-3 rounded-lg hover:bg-gray-400 transition-colors"
//                     disabled={isLoading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { useUpdateProfileMutation, useShowProfileQuery, useSendOTPMutation, useForgetPasswordMutation } from "../../../features/auth/userApiSlice";
import OTPEnterModal from "../OTPEnterModal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../features/auth/userAuthSlice";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: userData, isLoading: isProfileLoading } = useShowProfileQuery(id, { skip: !id });
  const [sendOTP] = useSendOTPMutation(); // For email change
  const [forgetPassword] = useForgetPasswordMutation(); // For password change (if needed)

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    imagePreview: null,
  });
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification
  const [otpFlow, setOtpFlow] = useState(""); // "emailChange" or "passwordChange"

  useEffect(() => {
    if (userData) {
      setFormValues({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        image: null,
        imagePreview: userData.images || null,
      });
      setOtpVerified(false); // Reset OTP verification on load
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && value !== userData?.email) {
      setOtpVerified(false); // Reset OTP verification if email changes
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
    return email.match(/@gmail\.com$/); // Simple Gmail validation
  };

  const handleSendOtp = async (flow) => {
    try {
      if (flow === "emailChange") {
        console.log("Emailchange flow")
        await sendOTP({ email: formValues.email }).unwrap();
        toast.success("OTP sent to your email");
      } else if (flow === "passwordChange") {
        console.log("passwordChange flow")
        await forgetPassword({ email: formValues.email }).unwrap();
        toast.success("OTP sent to your email for password reset");
      }
      setOtpFlow(flow);
      setIsOtpModalOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
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
    if (formValues.email !== userData?.email && !otpVerified) {
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

  return (
    <div className="mx-20 px-4 my-20">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 pr-0 md:pr-6 mb-8 md:mb-0">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <User className="mr-4 text-[#a96446]" size={27} />
                    <div className="w-full">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="mr-4 text-[#a96446]" size={27} />
                    <div className="w-full">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                      <div className="flex items-center">
                        <input
                          type="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleInputChange}
                          className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg"
                          placeholder="Enter your email"
                        />
                        {emailChanged && (
                          <button
                            type="button"
                            onClick={() => handleSendOtp("emailChange")}
                            disabled={!isEmailValid(formValues.email)}
                            className={`ml-2 px-3 py-1 rounded ${isEmailValid(formValues.email) ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-200"}`}
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="mr-4 text-[#a96446]" size={27} />
                    <div className="w-full">
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        className="w-full mt-1 font-medium text-gray-800 bg-transparent border-b px-4 py-3 rounded-lg"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-200 mx-4" />
              <div className="flex-1 md:pl-6 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-indigo-100">
                      <img
                        src={formValues.imagePreview || "https://via.placeholder.com/150"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <span className="text-[#a96446]">Upload</span>
                    </label>
                  </div>
                  <h2 className="text-3xl font-bold mt-6 text-center">{formValues.name || "Edit Your Profile"}</h2>
                </div>
                <div className="mt-8 w-full flex flex-col md:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isLoading || (emailChanged && !otpVerified)}
                    className={`flex-1 text-white py-3 rounded-lg ${
                      isLoading || (emailChanged && !otpVerified) ? "bg-orange-700 cursor-not-allowed" : "bg-orange-800/90 hover:bg-gray-400"
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="flex-1 bg-gray-600/30 text-white py-3 rounded-lg hover:bg-gray-400"
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
        flow={otpFlow} // Pass the flow type
      />
    </div>
  );
};

export default EditProfile;