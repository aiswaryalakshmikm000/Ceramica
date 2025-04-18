// backend/models/couponModel.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minLength: [3, "Coupon code must be at least 3 characters"],
      maxLength: [20, "Coupon code cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    discountType: {
      type: String,
      enum: {
        values: ["percentage", "flat"],
        message: "Discount type must be either 'percentage' or 'flat'",
      },
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      min: [1, "Discount value must be at least 1"],
      validate: {
        validator: function (value) {
          return this.discountType === "flat" ? value !== undefined : value === undefined;
        },
        message: "Discount value is required for flat discount type and must not be set for percentage type",
      },
    },
    discountPercentage: {
      type: Number,
      min: [1, "Discount percentage must be at least 1"],
      max: [80, "Discount percentage cannot exceed 80"],
      validate: {
        validator: function (value) {
          return this.discountType === "percentage" ? value !== undefined : value === undefined;
        },
        message: "Discount percentage is required for percentage discount type and must not be set for flat type",
      },
    },
    minPurchaseAmount: {
      type: Number,
      required: [true, "Minimum purchase amount is required"],
      min: [0, "Minimum purchase amount cannot be negative"],
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount cannot be negative"],
      validate: {
        validator: function (value) {
          return this.discountType === "percentage" ? value >= 0 : value === undefined;
        },
        message: "Max discount amount is required for percentage-based discounts and must not be set for flat discounts",
      },
    },
    validFrom: {
      type: Date,
      default: Date.now,
      required: [true, "Valid from date is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function (value) {
          return value > this.validFrom;
        },
        message: "Expiry date must be after the valid from date",
      },
    },
    usageLimit: {
      type: Number,
      required: [true, "Usage limit is required"],
      min: [1, "Usage limit must be at least 1"],
    },
    maxUsagePerUser: {
      type: Number,
      required: [true, "Max usage per user is required"],
      min: [1, "Max usage per user must be at least 1"],
      default: 1,
    },
    totalAppliedCount: {
      type: Number,
      default: 0,
      min: [0, "Total applied count cannot be negative"],
    },
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    customerType: {
      type: String,
      enum: {
        values: ["all", "new", "existing"],
        message: "Customer type must be 'all', 'new', or 'existing'",
      },
      default: "all",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "expired", "inactive"],
        message: "Status must be 'active', 'expired', or 'inactive'",
      },
      default: "active",
      required: [true, "Status is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure discount fields and status are set correctly
couponSchema.pre("save", function (next) {
  // Handle discount fields
  if (this.discountType === "percentage") {
    this.discountValue = undefined;
    if (this.discountPercentage && this.minPurchaseAmount) {
      const calculatedMax = (this.discountPercentage / 100) * this.minPurchaseAmount;
      this.maxDiscountAmount = this.maxDiscountAmount || calculatedMax;
    }
  } else if (this.discountType === "flat") {
    this.discountPercentage = undefined;
    this.maxDiscountAmount = undefined;
  }

  // Update status based on expiryDate
  const now = new Date();
  if (this.expiryDate < now && this.status !== "inactive") {
    this.status = "expired";
  } else if (this.status === "expired" && this.expiryDate >= now) {
    this.status = "active";
  }

  next();
});

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, expiryDate: 1, status: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;