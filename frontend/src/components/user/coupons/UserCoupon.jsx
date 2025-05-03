import React, { useState } from "react";
import { Copy, Clock, Ticket } from "lucide-react";
import { useGetUserCouponsQuery } from "../../../features/userAuth/userCouponApiSlice";
import { toast } from "react-toastify";
import Fallback from "../../common/Fallback";
import Breadcrumbs from "../../common/BreadCrumbs";

const UserCoupon = () => {
  const { data: couponData, isLoading, error } = useGetUserCouponsQuery();
  const [selectedTab, setSelectedTab] = useState("active");

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Coupons", href: "/coupons" },
  ];

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success(`Coupon code ${code} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
        toast.error("Failed to copy coupon code");
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
        <div className="px-24 mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Fallback isLoading={true} emptyIcon={<Ticket />} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
        <div className="px-24 mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <Fallback
              error={error?.data?.message || "Error loading coupons"}
              emptyActionText="Continue Shopping"
              emptyActionPath="/shop"
              emptyIcon={<Ticket />}
            />
          </div>
        </div>
      </div>
    );
  }

  const coupons = couponData?.coupons || [];
  const filteredCoupons = coupons.filter((coupon) => {
    if (selectedTab === "active") return coupon.status === "active";
    if (selectedTab === "expired") return coupon.status === "expired" || coupon.isExpired;
    if (selectedTab === "used") return coupon.status === "used";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Coupons</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          {/* Instructional Text */}
          <p className="text-sm text-gray-600 mb-4">
            Copy a coupon code and paste it during checkout to apply the discount.{" "}
            <a href="/checkout" className="text-orange-800 hover:underline">
              Go to Checkout
            </a>
          </p>

          {/* Coupon Section */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-center gap-x-4.">
                  {["active", "expired", "used"].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm capitalize ${
                        selectedTab === tab
                          ? "border-b-2 border-orange-800 text-orange-800 font-medium"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupons Grid */}
              {filteredCoupons.length > 0 ? (
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className={`border rounded-lg overflow-hidden relative transition-all ${
                        coupon.status === "active"
                          ? "border-gray-300 bg-orange-50/50 hover:border-orange-800"
                          : "border-gray-200 opacity-70"
                      }`}
                    >
                      {/* Status Overlays */}
                      {(coupon.status === "expired" || coupon.isExpired) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-10 z-10">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            Expired
                          </span>
                        </div>
                      )}
                      {coupon.status === "used" && !coupon.isExpired && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-10 z-10">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            Used
                          </span>
                        </div>
                      )}

                      {/* Coupon Header */}
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-900">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountPercentage}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </h3>
                          <span className="text-xs text-gray-500">
                            Min. Purchase: ₹{coupon.minPurchaseAmount}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {coupon.customerType === "new"
                            ? "For New Users"
                            : coupon.customerType === "existing"
                            ? "For Existing Users"
                            : "For All Users"}
                        </p>
                        {coupon.maxDiscountAmount && coupon.discountType === "percentage" && (
                          <p className="text-xs text-gray-500 mt-1">
                            Max Discount: ₹{coupon.maxDiscountAmount}
                          </p>
                        )}
                      </div>

                      {/* Coupon Footer */}
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500">
                            Valid until {new Date(coupon.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{coupon.code}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(coupon.code);
                            }}
                            disabled={coupon.status !== "active"}
                            className={`p-1 rounded relative group ${
                              coupon.status !== "active"
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                            aria-label={`Copy coupon code ${coupon.code}`}
                          >
                            <Copy size={16} />
                            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 right-0">
                              Copy Code
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-gray-600 text-center">
                  No {selectedTab} coupons available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCoupon;