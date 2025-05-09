import React, { useState } from "react";
import { useGetCouponsQuery, useDeleteCouponMutation } from "../../../features/adminAuth/adminCouponApiSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../common/BreadCrumbs";
import Pagination from "../../common/Pagination";
import CouponFilterSearchBar from "./CouponFilterSearchBar";
import AddCouponModal from "./AddCouponModal";
import Fallback from "../../common/Fallback"; 
import { Plus } from "lucide-react"; 

const AdminCouponPage = () => {
  const [filter, setFilter] = useState({
    search: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryParams = {
    search: filter.search || undefined,
    status: filter.status || undefined,
    page,
    limit,
  };

  const { data: couponsData, isLoading, error } = useGetCouponsQuery(queryParams);
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleFilterChange = (name, value) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilter({
      search: "",
      status: "",
    });
    setPage(1);
    toast.info("Filters reset successfully");
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const result = await deleteCoupon(couponId).unwrap();
      toast.success(result.message || "Coupon deactivated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to deactivate coupon");
    }
  };

  const getActionButton = (coupon) => {
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    const isExpired = expiryDate < currentDate;

    if (isExpired) {
      return (
        <span className="text-gray-400">No Actions Available</span>
      );
    }

    if (coupon.status === "inactive") {
      return (
        <span className="text-gray-400">Already Deactivated</span>
      );
    }

    return (
      <button
        onClick={() => handleDeleteCoupon(coupon._id)}
        className="text-red-500 hover:underline"
        disabled={coupon.status !== "active"}
      >
        Deactivate
      </button>
    );
  };

  const breadcrumbItems = [
    { label: "Admin" },
    { label: "Coupons", href: "/admin/coupons" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2">Coupon Management</h1>
          <p className="text-gray-600">Manage coupons, create new ones, and update status</p>
        </div>

        <CouponFilterSearchBar
          filter={filter}
          setFilter={setFilter}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          resetFilters={resetFilters}
          handleFilterChange={handleFilterChange}
          openModal={() => setIsModalOpen(true)}
        />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c73a8] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Min Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Usage/Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan="8">
                    <Fallback
                      isLoading={isLoading}
                      error={error}
                      emptyMessage={couponsData?.coupons?.length === 0 ? "No coupons available" : undefined}
                      emptyActionText="Add Coupon"
                      onEmptyAction={() => setIsModalOpen(true)}
                      emptyIcon={<Plus />}
                    />
                  </td>
                </tr>
                {couponsData?.coupons?.length > 0 &&
                  couponsData.coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.discountType.charAt(0).toUpperCase() + coupon.discountType.slice(1)} (
                        {coupon.discountType === "percentage" ? `${coupon.discountPercentage}%` : `₹${coupon.discountValue}`})
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">₹{coupon.minPurchaseAmount}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(coupon.validFrom).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.totalAppliedCount}/{coupon.usageLimit}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButton(coupon)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {couponsData?.coupons?.length > 0 && (
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, couponsData?.totalCouponsCount || 0)}</span> of{" "}
                  <span className="font-medium">{couponsData?.totalCouponsCount || 0}</span> results
                </p>
              </div>
              <div>
                <Pagination
                  currentPage={page}
                  totalPages={couponsData?.totalPages || 1}
                  totalItems={couponsData?.totalCouponsCount || 0}
                  itemsPerPage={limit}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </div>

        {isModalOpen && <AddCouponModal closeModal={() => setIsModalOpen(false)} />}
      </main>
    </div>
  );
};

export default AdminCouponPage;