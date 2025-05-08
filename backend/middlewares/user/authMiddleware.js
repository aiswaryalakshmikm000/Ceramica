const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../../models/userModel');

const tokenKey = process.env.TOKEN_KEY;

const authenticateToken = async (req, res, next) => {
    console.log('User Middleware - Received Cookies:', req.cookies);
  
    let token = req.cookies?.userAccessToken;
    console.log('User Middleware - Extracted Token:', token);
  
    if (!token) {
      console.log('User Middleware - No user access token in cookies');
      return res.status(401).json({ success: false, message: 'Access token is required' });
    }
  
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, tokenKey);
      console.log('User Middleware - Token decoded:', decoded);
  
      // Fetch the user from the database
      const user = await User.findById(decoded.user.id);
      if (!user) {
        console.log('User Middleware - User not found');
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      // Check if the user is blocked
      if (user.isBlocked) {
        console.log('User Middleware - User is blocked');
        res.clearCookie('userAccessToken');
        return res.status(403).json({ success: false, message: 'Your account is blocked. Please contact support.' });
      }
  
      // Attach user to the request
      req.user = decoded.user;
      next();
    } catch (error) {
      console.log('User Middleware - Invalid or expired access token:', error);
      return res.status(401).json({ success: false, message: 'Invalid or expired access token' });
    }
  };

module.exports = authenticateToken;


