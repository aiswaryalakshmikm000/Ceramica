import React, { useState } from "react";
import { Copy, Clock, CheckCircle, Ticket } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useNavigate } from "react-router-dom";
import Fallback from "../../common/Fallback";
import Breadcrumbs from "../../common/BreadCrumbs";

const Coupons = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Mock coupon data
  const coupons = [
    {
      id: 1,
      code: "CERAMIC25",
      discount: "25% OFF",
      description: "25% off on all ceramic mugs",
      validUntil: "July 31, 2023",
      isExpired: false,
      minPurchase: "$50.00",
      isUsed: false,
    },
    {
      id: 2,
      code: "FREESHIP100",
      discount: "FREE SHIPPING",
      description: "Free shipping on orders over $100",
      validUntil: "August 15, 2023",
      isExpired: false,
      minPurchase: "$100.00",
      isUsed: false,
    },
    {
      id: 3,
      code: "WELCOME15",
      discount: "15% OFF",
      description: "15% off your first purchase",
      validUntil: "December 31, 2023",
      isExpired: false,
      minPurchase: "$0.00",
      isUsed: true,
    },
    {
      id: 4,
      code: "SUMMER10",
      discount: "10% OFF",
      description: "10% off summer collection items",
      validUntil: "June 1, 2023",
      isExpired: true,
      minPurchase: "$0.00",
      isUsed: false,
    },
  ];

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert(`Coupon code ${code} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  const handleSelectCoupon = (coupon) => {
    if (!coupon.isExpired && !coupon.isUsed) {
      setSelectedCoupon(coupon);
    }
  };

  // Handle no-user state with Fallback
  if (!user) {
    return (
      <Fallback
        isLoading={false}
        error={null}
        noUser={!user}
        emptyMessage={null}
        emptyActionText="Continue Shopping"
        emptyActionPath="/shop"
        emptyIcon={<Ticket/>}
      />
    );
  }

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Coupons", href: "/coupons" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Coupons</h2>
          </div>
          {/* Add Breadcrumbs here */}
          <Breadcrumbs items={breadcrumbItems} />

          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {coupons.length > 0 ? (
                <div className="p-4 grid gap-4 md:grid-cols-2">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`border rounded-lg overflow-hidden relative cursor-pointer transition-all ${
                        coupon.isExpired || coupon.isUsed
                          ? "border-gray-200 opacity-70"
                          : selectedCoupon && selectedCoupon.id === coupon.id
                          ? "bg-orange-50 border-orange-800"
                          : "border-gray-300 hover:border-orange-800"
                      }`}
                      onClick={() => handleSelectCoupon(coupon)}
                    >
                      {coupon.isExpired && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            Expired
                          </span>
                        </div>
                      )}

                      {coupon.isUsed && !coupon.isExpired && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            Used
                          </span>
                        </div>
                      )}

                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-900">{coupon.discount}</h3>
                          <span className="text-xs text-gray-500">
                            Min. Purchase: {coupon.minPurchase}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500">
                            Valid until {coupon.validUntil}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{coupon.code}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(coupon.code);
                            }}
                            disabled={coupon.isExpired || coupon.isUsed}
                            className={`p-1 rounded ${
                              coupon.isExpired || coupon.isUsed
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Coupons Available
                  </h3>
                  <p className="text-gray-500">You don't have any coupons at the moment.</p>
                </div>
              )}
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

export default Coupons;