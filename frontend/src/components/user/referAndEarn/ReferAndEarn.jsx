
// import React, { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   Share2,
//   Copy,
//   Gift,
//   Users,
//   CheckCircle,
//   ArrowRight,
//   Wallet,
//   Award,
//   Clock,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import Breadcrumbs from "../../common/Breadcrumbs";
// import ReferralTabs from "./ReferralTabs";
// import { selectUser } from "../../../features/userAuth/userAuthSlice";
// import {
//   useGetReferralInfoQuery,
//   useApplyReferralCodeMutation,
// } from "../../../features/userAuth/userReferAndEarnApiSlice";

// const ReferAndEarn = () => {
//   const user = useSelector(selectUser);
//   const { data: referralInfo, isLoading, isError } = useGetReferralInfoQuery(
//     user.id
//   );

//   const [copied, setCopied] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [referralCodeInput, setReferralCodeInput] = useState("");
//   const [applyMessage, setApplyMessage] = useState("");
//   const [applyReferralCode, { isLoading: isApplying }] =
//     useApplyReferralCodeMutation();

//   const breadcrumbItems = [
//     { label: "My Account", href: "" },
//     { label: "Refer & Earn", href: "/refer-and-earn" },
//   ];

//   const copyToClipboard = () => {
//     const referralLink = `${referralInfo?.referralCode}`;
//     navigator.clipboard.writeText(referralLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };


//   const handleApplyReferralCode = async () => {
//     if (!referralCodeInput) {
//       setApplyMessage("Please enter a referral code");
//       return;
//     }

//     try {
//       const response = await applyReferralCode({
//         userId: user.id,
//         referralCode: referralCodeInput,
//       }).unwrap();
//       setApplyMessage(response.message);
//       setReferralCodeInput("");
//     } catch (error) {
//       setApplyMessage(error.data?.message || "Failed to apply referral code");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-md p-6">
//             <div className="flex justify-center items-center min-h-[200px]">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-800"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-md p-6">
//             <div className="flex justify-center items-center min-h-[200px]">
//               <div className="text-red-500">
//                 Failed to load referral information. Please try again later.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const referralSteps = [
//     {
//       icon: <Share2 size={20} />,
//       title: "Share Your Code",
//       description: "Share your unique referral code with friends and family",
//     },
//     {
//       icon: <Users size={20} />,
//       title: "Friend Signs Up",
//       description: "Your friend creates an account and applies your code",
//     },
//     {
//       icon: <Gift size={20} />,
//       title: "Friend Makes Purchase",
//       description: "Your friend completes their first purchase",
//     },
//     {
//       icon: <Wallet size={20} />,
//       title: "Both Get Rewarded",
//       description: "You get ₹100 and your friend gets ₹50 in coupons",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
//       <div className="px-24 mx-auto">
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Refer & Earn
//             </h2>
//           </div>
//           <Breadcrumbs items={breadcrumbItems} />

//           <div className="mt-8 space-y-8">
//             <div className="bg-orange-800/90 rounded-xl overflow-hidden">
//               <div className="flex flex-col md:flex-row">
//                 <div className="p-8 md:w-2/3">
//                   <h3 className="text-white text-2xl font-bold mb-2">
//                     Invite Friends & Earn Rewards
//                   </h3>
//                   <p className="text-orange-100 mb-6">
//                     Share your referral code with friends and both of you will get
//                     rewards when they apply your code.
//                   </p>

//                   <div className="space-y-4">
//                     <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//                       <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
//                         <div className="text-xs text-orange-200 mb-1">
//                           Your Referral Code
//                         </div>
//                         <div className="font-mono text-xl tracking-wider text-white">
//                           {referralInfo?.referralCode}
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={copyToClipboard}
//                           className="bg-white text-orange-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-50 transition-colors"
//                         >
//                           {copied ? (
//                             <CheckCircle size={18} />
//                           ) : (
//                             <Copy size={18} />
//                           )}
//                           {copied ? "Copied" : "Copy Code"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="hidden md:block md:w-1/3 bg-orange-800 p-8">
//                   <div className="h-full flex flex-col justify-center items-center text-center">
//                     <div className="bg-white/10 rounded-full p-4 mb-4">
//                       <Gift className="text-white h-10 w-10" />
//                     </div>
//                     <div className="text-3xl font-bold text-white mb-1">
//                       ₹{referralInfo?.totalEarnings}
//                     </div>
//                     <div className="text-orange-200">Total Earnings</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-orange-50 p-2 rounded-lg text-orange-800">
//                     <Users size={18} />
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-800">
//                       {referralInfo?.totalReferrals}
//                     </div>
//                     <div className="text-sm text-gray-500">Total Referrals</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-green-50 p-2 rounded-lg text-green-600">
//                     <CheckCircle size={18} />
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-800">
//                       {referralInfo?.completedReferrals}
//                     </div>
//                     <div className="text-sm text-gray-500">Completed</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
//                     <Clock size={18} />
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-gray-800">
//                       {referralInfo?.pendingReferrals}
//                     </div>
//                     <div className="text-sm text-gray-500">Pending</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-6">
//                 How It Works
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 {referralSteps.map((step, index) => (
//                   <div key={index} className="relative">
//                     <div className="flex flex-col">
//                       <div className="flex items-center mb-4">
//                         <div className="bg-orange-100 text-orange-800 h-8 w-8 rounded-full flex items-center justify-center mr-3">
//                           {index + 1}
//                         </div>
//                         <div className=" p-2 rounded-lg text-orange-800">
//                           {step.icon}
//                         </div>
//                       </div>
//                       <h4 className="text-base font-medium mb-1">
//                         {step.title}
//                       </h4>
//                       <p className="text-sm text-gray-500">
//                         {step.description}
//                       </p>
//                     </div>
//                     {index < referralSteps.length - 1 && (
//                       <div className="hidden md:block absolute top-8 -right-3">
//                         <ArrowRight className="text-gray-300" size={20} />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <ReferralTabs
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               referralInfo={referralInfo}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReferAndEarn;




import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Share2,
  Copy,
  Gift,
  Users,
  CheckCircle,
  ArrowRight,
  Wallet,
  Award,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "../../common/Breadcrumbs";
import ReferralTabs from "./ReferralTabs";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import {
  useGetReferralInfoQuery,
  useApplyReferralCodeMutation,
} from "../../../features/userAuth/userReferAndEarnApiSlice";

const ReferAndEarn = () => {
  const user = useSelector(selectUser);
  const { data: referralInfo, isLoading, isError } = useGetReferralInfoQuery(
    user.id
  );

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [applyReferralCode, { isLoading: isApplying }] =
    useApplyReferralCodeMutation();

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Refer & Earn", href: "/refer-and-earn" },
  ];

  const copyToClipboard = () => {
    const referralLink = `${referralInfo?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferralCode = async () => {
    if (!referralCodeInput) {
      setApplyMessage("Please enter a referral code");
      return;
    }

    try {
      const response = await applyReferralCode({
        userId: user.id,
        referralCode: referralCodeInput,
      }).unwrap();
      setApplyMessage(response.message);
      setReferralCodeInput("");
    } catch (error) {
      setApplyMessage(error.data?.message || "Failed to apply referral code");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-red-500">
              Failed to load referral information. Please try again later.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const referralSteps = [
    {
      icon: <Share2 size={20} />,
      title: "Share Your Code",
      description: "Share your unique referral code with friends and family",
    },
    {
      icon: <Users size={20} />,
      title: "Friend Signs Up",
      description: "Your friend creates an account and applies your code",
    },
    {
      icon: <Gift size={20} />,
      title: "Friend Makes Purchase",
      description: "Your friend completes their first purchase",
    },
    {
      icon: <Wallet size={20} />,
      title: "Both Get Rewarded",
      description: "You get ₹100 and your friend gets ₹50 in coupons",
    },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Refer & Earn
          </h2>
        </div>
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="bg-orange-800/90 rounded-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="p-6 sm:p-8 lg:w-2/3">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                  Invite Friends & Earn Rewards
                </h3>
                <p className="text-orange-100 text-sm sm:text-base mb-4 sm:mb-6">
                  Share your referral code with friends and both of you will get
                  rewards when they apply your code.
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                      <div className="text-xs text-orange-200 mb-1">
                        Your Referral Code
                      </div>
                      <div className="font-mono text-lg sm:text-xl tracking-wider text-white">
                        {referralInfo?.referralCode}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="bg-white text-orange-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-50 transition-colors text-sm sm:text-base"
                      >
                        {copied ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                        {copied ? "Copied" : "Copy Code"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 bg-orange-800 p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                <div className="bg-white/10 rounded-full p-4 mb-4">
                  <Gift className="text-white h-8 sm:h-10 w-8 sm:w-10" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  ₹{referralInfo?.totalEarnings}
                </div>
                <div className="text-orange-200 text-sm sm:text-base">Total Earnings</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-lg text-orange-800">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {referralInfo?.totalReferrals}
                  </div>
                  <div className="text-sm text-gray-500">Total Referrals</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {referralInfo?.completedReferrals}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {referralInfo?.pendingReferrals}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {referralSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 text-orange-800 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div className="p-2 rounded-lg text-orange-800">
                        {step.icon}
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {step.description}
                    </p>
                  </div>
                  {index < referralSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-3">
                      <ArrowRight className="text-gray-300" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <ReferralTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            referralInfo={referralInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;