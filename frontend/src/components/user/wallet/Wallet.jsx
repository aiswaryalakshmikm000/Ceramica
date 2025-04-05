import React from "react";
import { PlusCircle, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useNavigate } from "react-router-dom";
import Fallback from "../../common/Fallback";
import Breadcrumbs from "../../common/BreadCrumbs";

const Wallet = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Mock wallet data
  const balance = 125.75;
  
  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 50.00,
      date: "Jun 15, 2023",
      description: "Refund - Order #3892",
    },
    {
      id: 2,
      type: "debit",
      amount: 89.99,
      date: "Jun 10, 2023",
      description: "Purchase - Ceramic Vase",
    },
    {
      id: 3,
      type: "credit",
      amount: 100.00,
      date: "May 28, 2023",
      description: "Added funds",
    },
    {
      id: 4,
      type: "debit",
      amount: 45.75,
      date: "May 18, 2023",
      description: "Purchase - Ceramic Bowls",
    },
    {
      id: 5,
      type: "credit",
      amount: 25.00,
      date: "May 5, 2023",
      description: "Promotional credit",
    },
  ];

  // Handle loading, error, and no-user states with Fallback
  if (!user) {
    return (
      <Fallback
        isLoading={false}
        error={null}
        noUser={!user}
        emptyMessage={null}
        emptyActionText="Continue Shopping"
        emptyActionPath="/shop"
      />
    );
  }

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Wallet", href: "/wallet" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Wallet</h2>
          </div>
          {/* Add Breadcrumbs here */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-orange-800 to-gray-900 rounded-xl text-white p-6 mt-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-gray-300">Current Balance</h2>
                <div className="text-3xl font-bold mt-2">${balance.toFixed(2)}</div>
              </div>
              <CreditCard size={28} className="text-gray-300" />
            </div>

            <div className="flex mt-8 space-x-4">
              <button className="bg-white text-gray-900 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors">
                <PlusCircle size={16} className="mr-2" />
                Add Funds
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors">
                Withdraw
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <div className="p-4 text-gray-600 text-center">
                    No transactions available
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 flex items-center">
                      <div
                        className={`p-2 rounded-full mr-4 ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft size={20} />
                        ) : (
                          <ArrowUpRight size={20} />
                        )}
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </h3>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>

                      <div
                        className={`text-base font-medium ${
                          transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button className="text-gray-700 text-sm hover:text-gray-900 transition-colors">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 w-full text-black-800 hover:text-orange-900 py-2 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;