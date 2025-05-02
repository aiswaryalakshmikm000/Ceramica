const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
    },
    images: {
      type: String,
      required: true
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user", 
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows null values while maintaining uniqueness
    },
    referralCode:{
      type:String,
      unique:true,
      sparse: true 
    },
    referredBy:{
      type:String
    },
    referralRewards:{
      type:Number,
      default:0
    },
    totalReferrals:{
      type:Number,
      default:0
    },
    isReferralRewarded:{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
