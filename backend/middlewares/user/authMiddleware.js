const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenKey = process.env.TOKEN_KEY;

const authenticateToken = (req, res, next) => {
    console.log("Received Cookies:", req.cookies); // Debugging cookies

    let token = req.cookies?.userAccessToken; // Extract token from cookies
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]; // Assumes "Bearer <token>"
    }

    console.log("Extracted Token:", token); // Debugging

    if (!token) {
        console.log("No access token in cookies");
        return res.status(401).json({ success: false, message: 'Access token is required' });
    }


    jwt.verify(token, tokenKey, (error, decoded) => {
        if (error) {
            console.log("Invalid or expired access token:", error);
            return res.status(401).json({ message: 'Invalid or expired access token' });
        }
        req.user = decoded.user; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware/route
    });
};

module.exports = authenticateToken;




