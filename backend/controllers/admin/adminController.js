const bcrypt = require("bcrypt");
const Admin = require("../../models/adminModel");
const RefreshToken = require("../../models/refreshTokenModel");
const jwt = require("jsonwebtoken");

const hashPassword = require("../../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt/generateToken");
const setCookie = require("../../utils/jwt/setCookie");

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;


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

    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: securePassword,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role, 
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

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {

    const admin = await Admin.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin does not exist!",
      });
    }

    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }


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

    if (!adminRefreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    await RefreshToken.deleteOne({ token: adminRefreshToken });

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

    
    res.status(200).json({ message: "Admin logout successful" });

  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const refreshAccessToken = async (req, res) => {

  const refreshToken = req.cookies.adminRefreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "No refresh token provided.", success: false });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_KEY);
    const admin_id = decoded.user.id;


    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: admin_id,
      role: "admin",
      expiresAt: { $gt: new Date() }, 
    });

    if (!storedToken) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid refresh token" });
    }

    const adminDoc = await Admin.findById(admin_id).select("email role name"); 
    if (!adminDoc) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    const admin = {
      id: admin_id,
      email: adminDoc.email,
      role: adminDoc.role,
      name: adminDoc.name,
    };

    const newAccessToken = await generateAccessToken(admin);

    setCookie("adminAccessToken", newAccessToken, 30 * 60 * 1000, res);

    res.status(200).json({ success: true, message: "Access token refreshed", admin });

  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Token verification failed", error });
  }
};


const checkAuth = async (req, res) => {
  try {
    const adminId = req.user.id; 
    const admin = await Admin.findById(adminId).select('name email role');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error in admin checkAuth:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login, logout, register, refreshAccessToken, checkAuth };
