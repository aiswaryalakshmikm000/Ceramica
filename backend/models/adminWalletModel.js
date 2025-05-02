const mongoose = require("mongoose");

const adminWalletTransactionSchema = new mongoose.Schema(
    {
      transactionId: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      description: {
        type: String,
        required: true,
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      transactionType: {
        type: String,
        enum: ["order", "refund", "return", "item-return", "other", "referral", "cancel", "item-cancel"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed",
      },
    },
    { timestamps: true }
  );

const adminWalletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [adminWalletTransactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminWallet", adminWalletSchema);