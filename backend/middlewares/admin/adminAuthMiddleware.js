const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const adminTokenKey = process.env.ADMIN_TOKEN_KEY;

const authenticateAdminToken = (req, res, next) => {
    console.log('Admin Middleware - Received Cookies:', req.cookies);

    const token = req.cookies?.adminAccessToken;
    console.log('Admin Middleware - Extracted Token:', token);

    if (!token) {
        console.log('Admin Middleware - No admin token in cookies');
        return res.status(401).json({ success: false, message: 'Access denied, no token provided' });
    }

    jwt.verify(token, adminTokenKey, (error, decoded) => {
        if (error) {
            console.log('Admin Middleware - Invalid token or token expired:', error);
            return res.status(401).json({ message: 'Invalid or expired admin token' });
        }
        if (decoded.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
          }
        console.log('Admin Middleware - Admin authenticated:', decoded);
        req.user = decoded.user; 
        next(); 
    });
};

module.exports = authenticateAdminToken;

