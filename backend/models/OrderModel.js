const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  customerName: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true
      },
      color: {  
        name: { 
          type: String, 
          required: true 
        },
        image: { 
          type: String, 
          required: true 
        }
      },
      quantity: { 
        type: Number, 
        required: true,
        min: [1, "Quantity must be at least 1"]
      },
      price: { 
        type: Number, 
        required: true,
        min: 0 
      },
      discountedPrice: { 
        type: Number, 
        required: true,
        min: 0 
      },
      totalPrice: { 
        type: Number, 
        required: true,
        min: 0 
      },
      status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Pending",
      },
      deliveryDate: {
        type: Date
      }
    },
  ],
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  shippingFee: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  shippingAddress: {
    fullName: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    addressLine: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    state: { 
      type: String, 
      required: true 
    },
    pincode: { 
      type: String, 
      required: true 
    },
    landmark: { 
      type: String 
    },
  },
  paymentMethod: {
    type: String,
    enum: ["Cash on Delivery", "Credit Card", "Wallet", "PayPal", "Razorpay", "UPI"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Unpaid", "Refunded", "Failed"],
    default: "Unpaid",
  },
  transactionId: { 
    type: String 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  expectedDeliveryDate: { 
    type: Date 
  },
  activityLog: [
    { 
      status: { type: String }, 
      changedAt: { type: Date, default: Date.now } 
    },
  ],
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Order", orderSchema);