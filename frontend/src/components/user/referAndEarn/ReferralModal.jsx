import React, { useState } from "react";
import { Gift, X } from "lucide-react";
import { useApplyReferralCodeMutation } from "../../../features/userAuth/userReferAndEarnApiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";

const ReferralModal = ({ isOpen, onClose }) => {
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector(selectUser);
  const [applyReferralCode, { isLoading }] = useApplyReferralCodeMutation();

  const handleApply = async () => {
    if (!referralCode) {
      setMessage("Please enter a referral code");
      return;
    }

    try {
      const response = await applyReferralCode({
        userId: user.id,
        referralCode,
      }).unwrap();
      setMessage(response.message);
      setReferralCode("");
      setTimeout(onClose, 2000); 
    } catch (error) {
      setMessage(error.data?.message || "Failed to apply referral code");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <Gift className="text-orange-800" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">
            Apply Referral Code
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Enter a referral code to get ₹50 off on your first purchase!
        </p>
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-800"
        />
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="w-full bg-orange-800 text-white py-2 rounded-lg font-medium hover:bg-orange-900 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Applying..." : "Apply Code"}
        </button>
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralModal;