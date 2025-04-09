const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image:{
    type: String,
  },
  cancelProductReason: { type: String },
  returnRequest: {
    isRequested: { type: Boolean, default: false },
    requestedAt: { type: Date },
    reason: { type: String }, 
    isApproved: { type: Boolean, default: null },
    approvedAt: { type: Date }, 
    adminComment: { type: String } 
  },
  originalPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  latestPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    required: true,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Return-Requested', 'Return-Approved', 'Return-Rejected'],
    default: 'Pending'
  },
  deliveryDate: { type: Date },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalMRP: {
    type: Number,
    required: true,
    min: 0
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  couponDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  couponCode: { type: String },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    addressType: { 
      type: String, 
      enum: ['Home', 'Work', 'Other'],
      default: 'Home'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['Credit / Debit Card', 'UPI Payment', 'Cash on Delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  transactionId: { type: String },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  expectedDeliveryDate: { type: Date },
  returnRequest: {
    isRequested: { type: Boolean, default: false },
    requestedAt: { type: Date },
    reason: { type: String },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    adminComment: { type: String }
  },
  cancelReason: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return-Requested', 'Return-Approved', 'Return-Rejected', 'Returned'],
    default: 'Pending'
  },
  activityLog: [{
    status: { type: String },
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);