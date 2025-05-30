import React, { useState } from "react";
import { useCreateCouponMutation } from "../../../features/adminAuth/adminCouponApiSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const AddCouponModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    customerType: "all",
    discountType: "percentage",
    discountValue: "",
    discountPercentage: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    validFrom: "",
    expiryDate: "",
    maxUsagePerUser: 1,
    usageLimit: "",
  });

  const [error, setError] = useState("");
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    const {
      code,
      description,
      discountType,
      discountValue,
      discountPercentage,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      expiryDate,
      usageLimit,
      maxUsagePerUser,
    } = formData;

    if (!code) return "Coupon code is required";
    if (code.length < 3 || code.length > 20) return "Coupon code must be between 3 and 20 characters";

    if (!description) return "Description is required";
    if (description.length > 500) return "Description cannot exceed 500 characters";

    if (!discountType) return "Discount type is required";
    if (discountType === "flat") {
      if (!discountValue || discountValue < 1) return "Discount value must be at least 1 for flat discount";
    } else if (discountType === "percentage") {
      if (!discountPercentage || discountPercentage < 1 || discountPercentage > 80) {
        return "Discount percentage must be between 1 and 80";
      }
      if (maxDiscountAmount && maxDiscountAmount < 0) {
        return "Maximum discount amount cannot be negative";
      }
    }

    if (!minPurchaseAmount || minPurchaseAmount < 0) {
      return "Minimum purchase amount is required and cannot be negative";
    }

    if (!validFrom) return "Valid from date is required";
    if (!expiryDate) return "Expiry date is required";
    if (new Date(expiryDate) <= new Date(validFrom)) {
      return "Expiry date must be after valid from date";
    }

    if (!usageLimit || usageLimit < 1) return "Usage limit must be at least 1";
    if (!maxUsagePerUser || maxUsagePerUser < 1) return "Max usage per user must be at least 1";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createCoupon(formData).unwrap();
      toast.success("Coupon created successfully");
      closeModal();
    } catch (err) {
      setError(err?.data?.message || "Failed to create coupon");
      toast.error(err?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#3c73a8]">Add New Coupon</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="text-center mb-4">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Type
              </label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="existing">Existing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              {formData.discountType === "percentage" ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="1"
                    max="80"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                    required
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                    required
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                name="minPurchaseAmount"
                value={formData.minPurchaseAmount}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Discount Amount
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valid From
              </label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Usage Per User
              </label>
              <input
                type="number"
                name="maxUsagePerUser"
                value={formData.maxUsagePerUser}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usage Limit
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] ${
                isCreating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponModal;