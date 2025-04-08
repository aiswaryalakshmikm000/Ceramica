const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/userModel");
const RefreshToken = require("../../models/refreshTokenModel");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt/generateToken");
const setCookie = require("../../utils/jwt/setCookie");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "No credential provided",
    });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.googleId) {
      return res.status(400).json({
        success: false,
        message: "User already registered with email and password. Please try logging in normally.",
      });
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser && !existingUser.googleId) {
        return res.status(400).json({
          success: false,
          message: "User already registered with email and password. Please try logging in normally.",
        });
      }
      if (existingUser) {
        user = existingUser;
        user.googleId = googleId;
        user.images = picture;
        await user.save();
      } else {
        user = new User({
          googleId,
          email,
          name,
          role: "user",
          images: picture,
          isVerified: true,
        });
        await user.save();
      }
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Please contact support.",
      });
    }

    const userData = {
      id: user._id,
      email: user.email,
      role: user.role || "user", 
      name: user.name,
    };


    // Generate tokens
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Remove old refresh tokens for security
    await RefreshToken.deleteMany({ user: user._id });

    // Save refresh token in DB
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      user: user._id,
      role: "user",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    });
    await newRefreshToken.save();

    // Set tokens in cookies
    setCookie("userAccessToken", accessToken, 15 * 60 * 1000, res); 
    setCookie("userRefreshToken", refreshToken, 30 * 24 * 60 * 60 * 1000, res);


    // Return user data
    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        _id: user._id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        role: user.role,
        images: user.images
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(400).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};

module.exports = { googleAuth };