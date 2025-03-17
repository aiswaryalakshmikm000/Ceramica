const bcrypt = require("bcrypt");

//models
const User = require("../../models/userModel");
const RefreshToken = require("../../models/refreshTokenModel");

//utils
const hashPassword = require("../../utils/hashPassword");
const setCookie = require("../../utils/jwt/setCookie");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt/generateToken");

//signup function
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  console.log(req.body)

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists by email OR phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    // Hash password before saving
    const securePassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: securePassword,
    });

    console.log("User registered successfully");

    res.json({
      success: true,
      message: "User Registered Successfully",
      newUser: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
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

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    console.log("Checking if user exists...");

    // Check if the user exists
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please create a new account.",
      });
    }

    // Check if the user is blocked
    if (userExist.isBlocked) {
      console.log("User is blocked");
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Please contact support.",
      });
    }

    // Check if the user signed up via Google and does not have a password
    if (!userExist.password) {
      return res.status(400).json({
        success: false,
        message: "You signed up with Google. Please log in using Google.",
      });
    }

    console.log("Verifying password...");

    // Check password
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day expiry
    });
    await newRefreshToken.save();

    // Use setCookie function to store tokens
    setCookie("userAccessToken", accessToken, 15 * 60 * 1000, res); // 15 mins expiry  15 * 60 * 1000
    setCookie("userRefreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000, res); // 7 day expiry

    console.log("User logged in successfully!");

    // Send response (excluding tokens since they are in cookies)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
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

    // Remove the refresh token from the database
    const deletedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });

    if (!deletedToken) {
      return res.status(400).json({ message: "Token not found in database" });
    }

    // Clear access and refresh tokens from cookies for security
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
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    const userId = decoded.user.id;

    console.log("Decoded data:", decoded, "User ID:", userId, "Refresh Token:", refreshToken);

    // Check if the refresh token exists in the database and is valid
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      user: userId,
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      console.log("Invalid refresh token in database");
      return res.status(403).json({ success: false, error: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: userId,
      email: decoded.user.email,
      role: decoded.user.role
    });

    // Set new access token in a cookie
    setCookie("userAccessToken", newAccessToken, 15 * 60 * 1000, res); // 15 minutes

    console.log("New access token generated and set in cookie");

    res.status(200).json({ success: true, message: "Access token refreshed" });

  } catch (error) {
    console.log("Error in refreshing token:", error.message);
    res.status(403).json({ success: false, message: "Token verification failed", error });
  }
};



module.exports = {
  register,
  login,
  logout,
  refreshUserToken,
};
