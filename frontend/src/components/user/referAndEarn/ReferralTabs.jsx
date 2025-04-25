import React from "react";
import { Gift, Wallet, Award, Share2 } from "lucide-react";

const ReferralTabs = ({ activeTab, setActiveTab, referralInfo }) => {
    console.log("##########3", referralInfo)
  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-orange-800 text-orange-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Benefits
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-orange-800 text-orange-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Referral History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <BenefitsTab />
      ) : (
        <HistoryTab referralHistory={referralInfo?.referralHistory} />
      )}
    </div>
  );
};

// Benefits Tab Component
const BenefitsTab = () => {
  return (

    
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="bg-orange-50 p-3 rounded-lg text-orange-800 inline-block mb-4">
          <Gift size={20} />
        </div>
        <h4 className="text-lg font-medium mb-2">For Your Friends</h4>
        <p className="text-gray-600 text-sm">
          Your friends get ₹100 off on their first purchase when they sign up using your referral code.
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="bg-orange-50 p-3 rounded-lg text-orange-800 inline-block mb-4">
          <Wallet size={20} />
        </div>
        <h4 className="text-lg font-medium mb-2">For You</h4>
        <p className="text-gray-600 text-sm">
          You earn ₹100 in your Ceramica wallet for each friend who makes their first purchase.
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="bg-orange-50 p-3 rounded-lg text-orange-800 inline-block mb-4">
          <Award size={20} />
        </div>
        <h4 className="text-lg font-medium mb-2">No Limits</h4>
        <p className="text-gray-600 text-sm">
          There's no limit to how many friends you can refer or how much you can earn!
        </p>
      </div>
    </div>
  );
};

// History Tab Component
const HistoryTab = ({ referralHistory = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {referralHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Code
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referralHistory.map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {referral.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        referral.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {referral.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{referral.reward}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {referral.couponCode || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <Share2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">
            You haven't referred anyone yet. Start sharing your referral code!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReferralTabs;