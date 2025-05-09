const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Offer name is required'],
      trim: true,
    },
    targetType: {
      type: String,
      enum: ['Product', 'Category'],
      required: [true, 'Offer type is required'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
      refPath: 'targetType',
    },
    discountType: {
      type: String,
      enum: ['percentage'],
      default: 'percentage',
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [1, 'Discount value must be at least 1'],
      max: [80, 'Discount value cannot exceed 80'],
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Max discount amount cannot be negative'],
      default: 0,
    },
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to convert name to uppercase
offerSchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  next();
});

// Validate expiry date is after validFrom
offerSchema.pre('save', function (next) {
  if (this.expiryDate <= this.validFrom) {
    return next(new Error('Expiry date must be after valid from date'));
  }
  // Set status to expired if expiry date is in the past
  if (this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;