
const mongoose = require("mongoose");

const userCouponSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliedCount: {
      type: Number,
      default: 0,
      min: [0, "Applied count cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Composite index for faster lookups
userCouponSchema.index({ userId: 1, couponId: 1 });

const UserCoupon = mongoose.model("UserCoupon", userCouponSchema);
module.exports = UserCoupon;