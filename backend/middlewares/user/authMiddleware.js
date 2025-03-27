const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenKey = process.env.TOKEN_KEY;

const authenticateToken = (req, res, next) => {
    console.log("==========================================================Received Cookies:", req.cookies); 

    let token = req.cookies?.userAccessToken; 

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]; 
    }

    console.log("Extracted Token:", token); 

    if (!token) {
        console.log("No access token in cookies");
        return res.status(401).json({ success: false, message: 'Access token is required' });
    }


    jwt.verify(token, tokenKey, (error, decoded) => {
        if (error) {
            console.log("Invalid or expired access token:", error);
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }
        req.user = decoded.user; 
        next(); 
    });
};

module.exports = authenticateToken;


