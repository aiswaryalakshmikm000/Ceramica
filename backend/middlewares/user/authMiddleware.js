const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenKey = process.env.TOKEN_KEY;

const authenticateToken = (req, res, next) => {
    console.log('User Middleware - Received Cookies:', req.cookies);

    let token = req.cookies?.userAccessToken; 
    console.log('User Middleware - Extracted Token:', token);

    console.log("Extracted Token:", token); 

    if (!token) {
        console.log('User Middleware - No user access token in cookies');
        return res.status(401).json({ success: false, message: 'Access token is required' });
    }

    jwt.verify(token, tokenKey, (error, decoded) => {
        if (error) {
            console.log('User Middleware - Invalid or expired access token:', error);
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }
        console.log('User Middleware - Token decoded:', decoded);
        req.user = decoded.user; 
        next(); 
    });
};

module.exports = authenticateToken;


