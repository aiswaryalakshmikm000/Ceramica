const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const { cloudinaryImageUploadMethod } = require("../../utils/cloudinary/cloudinaryUpload");
const {cloudinaryDeleteImages} = require("../../utils/cloudinary/deleteImages");

//models
const User = require("../../models/userModel");
const RefreshToken = require("../../models/refreshTokenModel");
const OTP = require("../../models/otpModel");

//utils
const hashPassword = require("../../utils/hashPassword");
const setCookie = require("../../utils/jwt/setCookie");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt/generateToken");
const generateOTP = require("../../utils/otp/generateOTP");
const sendVerificationEmail = require("../../utils/nodemailer/sendVarificationEmail");
const sendResetPasswordMail = require("../../utils/nodemailer/forgetPassword");
const generateReferralCode = require('../../utils/services/genrateReferralCode')

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const file = req.file;

  if (!name || !email || !phone || !password) {

    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      if (!existingUser.isVerified){
        return res.status(409).json({success: false, message: "This email or phone number is already registered but not verified. Please use the forgot password flow to verify your email with an OTP."})
      }
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    let imageUrl = "";
    if (file) {
      imageUrl = await cloudinaryImageUploadMethod(file.buffer);
    }

    const securePassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: securePassword,
      images: imageUrl || "",
      isVerified: false,
    });

    const referralCode = await generateReferralCode(newUser._id);
    newUser.referralCode = referralCode;
    await newUser.save();

    res.json({
      success: true,
      message: "User created. Please verify your email with OTP.",
      newUser: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        images: newUser.images,
        referralCode: newUser.referralCode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please create a new account.",
      });
    }

    if (userExist.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Please contact support.",
      });
    }

    if (!userExist.password) {
      return res.status(400).json({
        success: false,
        message: "You signed up with Google. Please log in using Google.",
      });
    }

    if(!userExist.isVerified){
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP before logging in by using forget password flow."
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate tokens
    const userData = {
      id: userExist._id,
      email: userExist.email,
      role: userExist.role,
      referredBy: userExist.referredBy || null,
    };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Remove old refresh tokens for security
    await RefreshToken.deleteMany({ user: userExist._id });

    // Save refresh token in DB
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      user: userExist._id,
      role: userExist.role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await newRefreshToken.save();

    // Use setCookie function to store tokens
    setCookie("userAccessToken", accessToken, 1 * 60 * 1000, res); 
    setCookie("userRefreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000, res); 

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
        images: userExist.images,
        referredBy: userExist.referredBy,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
      error: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["userRefreshToken"];

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "No refresh token found" });
    }

    const deletedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });

    if (!deletedToken) {
      return res.status(400).json({ success: false, message: "Token not found in database" });
    }

    res.clearCookie("userAccessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie("userRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ success:true, message: "User logged out successfully" });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const refreshUserToken = async (req, res) => {

  const refreshToken = req.cookies.userRefreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided.", success: false });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    const userId = decoded.user.id;

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: userId,
      role: "user",
      expiresAt: { $gt: new Date() },
    });


    if (!storedToken) {
      return res.status(403).json({ success: false, error: "Invalid refresh token" });
    }

    // Fetch user from the database
    const userDoc = await User.findById(userId).select("email role name phone images isBlocked");
    if (!userDoc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      images: userDoc.images,
      isBlocked: userDoc.isBlocked,
      referredBy: userDoc.referredBy || null,
    };
    
    const newAccessToken = generateAccessToken(user);

    setCookie("userAccessToken", newAccessToken, 1 * 60 * 1000, res); 

    res.status(200).json({ success: true, message: "Access token refreshed", user: user });

  } catch (error) {
    res.status(403).json({ success: false, message: "Token verification failed", error });
  }
};


const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    const otp = generateOTP();

    const otpEntry = await OTP.create({
      email,
      otp,
    });

    await sendVerificationEmail(email, otp);
    res.json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    res.status(error.status||500).json({success:false,message:"Internal server error."})
  }
};


const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const otpData = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (!otpData.length || otp !== otpData[0].otp) {
      const errorMessage = otpData.length ? "OTP is not valid" : "OTP expired";
      return res.status(400).json({ success: false, message: errorMessage });
    }
    
    const user = await User.findOneAndUpdate(
      {email},
      {isVerified: true},
      {new: true},
    ).select("-password")

    res.status(200).json({ success: true, message: "OTP verified successfully.", user });
  } catch (error) {
    const errorMessage=error.message||"OTP Verification failed."
    res.status(error.status||500).json({success:false,message:errorMessage})
  }
};


const forgetPassword=async(req,res)=>{
  const {email}=req.body
  if(!validator.isEmail(email)){
    return res.status(400).json({message:"Invalid email address."})
  }
  try {
    if(!email){
      return res.status(400).json({success:false,error:"Invalid credentials"})
    }
   const user= await User.findOne({email})
   if(!user){
    return res.status(404).json({success:false, message:'User doesnot exist'})
   }

   if (!user.password) {
    return res.status(404).json({
      success: false,
      message: "This account was created using Google login. Password reset is not available.",
    });
  }

  const otp=generateOTP();
  await OTP.create({
    email,
    otp
   })

    sendResetPasswordMail(email,otp)
    res.status(201).json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    res.status(error.status||500).json({message:"Internal server error."})
  }
}

const verifyResetOtp=async(req,res)=>{
  const {email,otp}=req.body;
  try {
   const otpData= await OTP.findOne({  email}).sort({createdAt:-1}).limit(1)
   
   if(otp!=otpData.otp || !otpData?.otp.length){
    const errorMessage=!otpData?.otp.length?"OTP Expired.":"OTP is not valid."
  return res.status(400).json({message:errorMessage})
  }

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  ).select("-password");

  res.status(200).json({success:true,message:"OTP verfied successfully."})
  } catch (error) {
    const errorMessage=error.message||"OTP Verification failed."
    res.status(error.status||500).json({success:false,message:errorMessage})
  }
}

const resetPassword=async(req,res)=>{
  const{email,password}=req.body;
  if(!email.trim()||!password.trim()||password.length<6){
    return res.status(400).json({success:false,message:"Invalid credentials"})
  }
  try {
   const user=await User.findOne({email})
   if(!user){
    return res.status(404).json({message:"User doesnt exist."})
   }

   const isSamePassword=await bcrypt.compare(password, user.password)
   if(isSamePassword){
    return res.status(400).json({
      success: false,
      message: "You cannot reuse your old password."
    })
   }
   const securePassword=await hashPassword(password)
   user.password=securePassword;
   await user.save()
   res.status(200).json({success:true,message:'Password updated successfully'})
  } catch (error) {
    res.status(error.status||500).json({success:false,message:"Password resetting failed."})
  }
}

const verifyPassword=async(req,res)=>{
  const{userId}=req.params
  const{currentPassword}=req.body;
try {
  if(!userId || !currentPassword){
    return res.status(400).json({success:false, message:"Invalid credentials"})
  }
 const user= await User.findById(userId)
 if(!user){
  return res.status(404).json({success:false, message:"User not found."})
 }
 const isPasswordCorrect=await bcrypt.compare(currentPassword,user.password)
 if(!isPasswordCorrect){
  return res.status(400).json({success:false, message:"Incorrect Password"})
 }
 
res.status(200).json({success:true, message:"Password verified."})
} catch (error) {
  res.status(error.status||500).json({success:false, message:'Password verification failed.'})
}
}


const changePassword=async(req,res)=>{
  const {userId}=req.params
  const {currentPassword,newPassword}=req.body;
  if(!newPassword.trim()||newPassword.length<6||!userId){
    return res.status(400).json({success:false,message:"Invalid credentials"})
  }
if(currentPassword===newPassword){
  return res.status(400).json({success:false, message:"New password cannot be the old password."})
}
  try {
    const user=await User.findById(userId)

    if(!user){
      return res.status(404).json({success:false, message:"User not found"})
    }
    const securePassword= await hashPassword(newPassword)
    await User.findOneAndUpdate({_id:userId},{$set:{password:securePassword}})
    res.status(200).json({success:true,message:"Password updated"})
  } catch (error) {
    res.status(error.status||500).json({success:true, message:"Failed to update password"})
  }
}


const checkAuth = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('name email role phone images isBlocked referredBy');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact support' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        images: user.images,
        isBlocked: user.isBlocked,
        referredBy: user.referredBy || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = {
  register,
  login,
  logout,
  refreshUserToken,
  verifyOTP,
  sendOTP,
  forgetPassword,
  verifyResetOtp,
  resetPassword,
  verifyPassword,
  changePassword,
  checkAuth,
};
