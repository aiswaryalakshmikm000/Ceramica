const bcrypt = require("bcrypt");
const Admin = require("../../models/adminModel");
const RefreshToken = require("../../models/refreshTokenModel");
const jwt = require("jsonwebtoken");

//utils
const hashPassword = require("../../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt/generateToken");
const setCookie = require("../../utils/jwt/setCookie");

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email or phone number already exists",
      });
    }

    const securePassword = await hashPassword(password);

    // Create a new admin
    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: securePassword,
      role: "admin",
    });

    console.log("Admin registered successfully");

    // Send response with admin details (without tokens)
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role, // Always "admin"
      },
    });
  } catch (error) {
    console.error("Error in admin registration:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", req.body);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    console.log("Checking if admin exists...");

    const admin = await Admin.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin does not exist!",
      });
    }

    console.log("Admin found, verifying password...");

    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    console.log("Password verified, generating tokens...");

    const adminData = { id: admin._id, email: admin.email, role: admin.role };
    const adminAccessToken = generateAccessToken(adminData);
    const adminRefreshToken = generateRefreshToken(adminData);

    // Save refresh token in DB
    const newRefreshToken = new RefreshToken({
      token: adminRefreshToken,
      user: admin._id,
      role: admin.role,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newRefreshToken.save();

    // Set tokens in cookies
    setCookie("adminAccessToken", adminAccessToken, 30 * 60 * 1000, res);
    setCookie("adminRefreshToken", adminRefreshToken, 15 * 24 * 60 * 60 * 1000, res); 

    console.log("Admin logged in successfully.");

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed due to an internal error",
      error: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    const adminRefreshToken = req.cookies["adminRefreshToken"];
    console.log("Admin REF:", adminRefreshToken);

    if (!adminRefreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    // Remove the refresh token from the database
    await RefreshToken.deleteOne({ token: adminRefreshToken });

    // Clear access and refresh tokens from cookies
    res.clearCookie("adminAccessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie("adminRefreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    console.log("Admin logout successful.");
    
    res.status(200).json({ message: "Admin logout successful" });

  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const refreshAccessToken = async (req, res) => {
  console.log("REFRESHING ADMIN ACCESS TOKEN");

  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ error: "No refresh token provided.", success: false });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_KEY);
    console.log('DECODED', decoded)
    const admin_id = decoded.user.id;
    console.log("decoded role",decoded.user.role)

    // Check if the refresh token exists in the database and is valid
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: admin_id,
      role: "admin",
      expiresAt: { $gt: new Date() }, // Fix newDate() -> new Date()
    });

    if (!storedToken) {
      console.log("Invalid refresh token in database");
      return res
        .status(403)
        .json({ success: false, error: "Invalid refresh token" });
    }

    // Fetch admin from the database
    const adminDoc = await Admin.findById(admin_id).select("email role name"); // Error: Admin model not defined?
    if (!adminDoc) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    // Construct the admin object
    const admin = {
      id: admin_id,
      email: adminDoc.email,
      role: adminDoc.role,
      name: adminDoc.name,
    };

    // Generate a new access token
    const newAccessToken = await generateAccessToken(admin);

    // Use setCookie function to store the new access token
    setCookie("adminAccessToken", newAccessToken, 30 * 60 * 1000, res);

    console.log("New admin access token generated and set in cookie.");

    res.status(200).json({ success: true, message: "Access token refreshed", admin });

  } catch (error) {
    console.log("Error in refreshing token", error.message);
    res
      .status(403)
      .json({ success: false, message: "Token verification failed", error });
  }
};



module.exports = { login, logout, register, refreshAccessToken };
