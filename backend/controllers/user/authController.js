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


//signup function
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const file = req.file;

  console.log(req.body)
  console.log(req.file)

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

    console.log("User registered successfully");

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
      },
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



//login function
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    console.log("Checking if user exists...");

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please create a new account.",
      });
    }

    if (userExist.isBlocked) {
      console.log("User is blocked");
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
      console.log("user is not verified")
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP before logging in."
      })
    }
    console.log("Verifying password...");

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
    console.log("Generating tokens...");

    // Generate tokens
    const userData = {
      id: userExist._id,
      email: userExist.email,
      role: userExist.role,
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
    setCookie("userAccessToken", accessToken, 15 * 60 * 1000, res); 
    setCookie("userRefreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000, res); 

    console.log("User logged in successfully!");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
        images: userExist.images,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
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
      return res.status(400).json({ message: "No refresh token found" });
    }

    console.log("Logging out user with refreshToken:", refreshToken);

    const deletedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });

    if (!deletedToken) {
      return res.status(400).json({ message: "Token not found in database" });
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

    console.log("User logout successful.");

    res.status(200).json({ message: "User logged out successfully" });

  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const refreshUserToken = async (req, res) => {
  console.log("Refreshing user access token");

  const refreshToken = req.cookies.userRefreshToken;
  if (!refreshToken) {
    console.log("No refresh token provided");
    return res.status(401).json({ error: "No refresh token provided.", success: false });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    console.log("decoded User", decoded)
    const userId = decoded.user.id;
    console.log("Role decoded", userId, decoded.user.role)

    console.log("Decoded data:", decoded, "User ID:", userId, "Refresh Token:", refreshToken);

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: userId,
      role: "user",
      expiresAt: { $gt: new Date() },
    });
    console.log("Stored token from DB:", storedToken);

    if (!storedToken) {
      console.log("Invalid refresh token in database");
      return res.status(403).json({ success: false, error: "Invalid refresh token" });
    }

    // Fetch user from the database
    const userDoc = await User.findById(userId).select("email role name");
    if (!userDoc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = {
      id: userId,
      email: userDoc.email,
      role: userDoc.role,
      name: userDoc.name 
    };

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Set new access token in a cookie
    setCookie("userAccessToken", newAccessToken, 15 * 60 * 1000, res); 

    console.log("New access token generated and set in cookie");

    res.status(200).json({ success: true, message: "Access token refreshed", user: user });

  } catch (error) {
    console.log("Error in refreshing token:", error.message);
    res.status(403).json({ success: false, message: "Token verification failed", error });
  }
};


//generate-otp
const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const otpEntry = await OTP.create({
      email,
      otp,
    });
    console.log("otp saved in db", otpEntry);

    await sendVerificationEmail(email, otp);
    console.log("otp sent successfully")
    res.json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    console.log("Error in sendOTP:", error.message);
    res.status(error.status||500).json({success:false,message:"Internal server error."})
  }
};


const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const otpData = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("otp query", otpData);
    //verifying otp
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
    console.log("otp verified");
  } catch (error) {
    console.log("error in otp verification", error.message);
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
    //find user exist
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
  //generate otp
  await OTP.create({
    email,
    otp
   })
    //send mail with to email
    sendResetPasswordMail(email,otp)
    console.log("forget password otp sent successfully")
    res.status(201).json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    res.status(error.status||500).json({message:"Internal server error."})
  }
}

const verifyResetOtp=async(req,res)=>{
  const {email,otp}=req.body;
  console.log("verifying otp",otp);
  try {
    //check otp with email and otp and newest otp
   const otpData= await OTP.findOne({  email}).sort({createdAt:-1}).limit(1)
   console.log("otpdata",otpData);
   
   if(otp!=otpData.otp || !otpData?.otp.length){
    const errorMessage=!otpData?.otp.length?"OTP Expired.":"OTP is not valid."
  return res.status(400).json({message:errorMessage})
  }
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
    console.log("error resdetting password",error);
    res.status(error.status||500).json({success:false,message:"Password resetting failed."})
  }
}




const verifyPassword=async(req,res)=>{
  console.log("verifiying password");
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
 console.log("verified successfully");
 
res.status(200).json({success:true, message:"Password verified."})
} catch (error) {
  console.log("error verifying password",error);
  res.status(error.status||500).json({success:false, message:'Password verification failed.'})
}
}


const changePassword=async(req,res)=>{
  console.log("changing");
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
    console.log("Error CHANGING PASSWORD",error);
    res.status(error.status||500).json({success:true, message:"Failed to update password"})
  }
}


const checkAuth = async (req, res) => {
  console.log("#$%^&*%$#@!$&^*%$#@%&^* user checkauth")
  try {
    const userId = req.user.id; // From authenticateToken middleware
    const user = await User.findById(userId).select('name email role phone images isBlocked');

    if (!user) {
      console.log("user not found in db");
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(403).json({ success: false, message: 'Account is blocked. Contact support' });
    }

    console.log("user found from check auth",user)

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        images: user.images,
        isBlocked: user.isBlocked
      },
    });
  } catch (error) {
    console.error('Error in checkAuth:', error);
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
