const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const adminTokenKey = process.env.ADMIN_TOKEN_KEY;

const authenticateAdminToken = (req, res, next) => {
    console.log("Received Cookies:", req.cookies); 

    const token = req.cookies?.adminAccessToken;
    console.log("Extracted Token:", token);

    if (!token) {
        console.log("No admin token in cookies");
        return res.status(401).json({ success: false, message: 'Access denied, no token provided' });
    }

    jwt.verify(token, adminTokenKey, (error, decoded) => {
        if (error) {
            console.log("Invalid token or token expired:", error);
            return res.status(401).json({ message: 'Invalid or expired admin token' });
        }
        if (decoded.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
          }
        console.log("ADmin authenticated")
        req.user = decoded.user; 
        next(); 
    });
};

module.exports = authenticateAdminToken;

