const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const adminTokenKey = process.env.ADMIN_TOKEN_KEY;

const authenticateAdminToken = (req, res, next) => {
    console.log("Received Cookies:", req.cookies); // Debugging cookies

    const token = req.cookies?.adminAccessToken; // Extract token from cookies
    console.log("Extracted Token:", token); // Log token

    if (!token) {
        console.log("No admin token in cookies");
        return res.status(401).json({ success: false, message: 'Access denied, no token provided' });
    }

    jwt.verify(token, adminTokenKey, (error, decoded) => {
        if (error) {
            console.log("Invalid token or token expired:", error);
            return res.status(401).json({ message: 'Invalid or expired admin token' });
        }
        console.log("ADmin authenticated")
        req.user = decoded.user; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware/route
    });
};

module.exports = authenticateAdminToken;




// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const adminTokenKey = process.env.ADMIN_TOKEN_KEY;



// const authenticateAdminToken = (req, res, next) => {

//     console.log("Received Headers:", req.headers);  // Debugging headers

//     const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

//     console.log("Extracted Token:", token);  // Log token

//     if (!token) {
//         console.log("no admin token");
//         return res.status(401).json({ success:false, message: 'Access denied, no token provided' });
//     }

//     jwt.verify(token, adminTokenKey, (error, decoded) => {
//         if (error) {
//             console.log("invalid token or token expired ",error);
//             return res.status(401).json({ message: 'Invalid or expired admin token' });
//         }
//         req.user = decoded.user; // Add decoded user data to the request object
//         next(); // Continue to the next middleware/route
//     });
// };

// module.exports = authenticateAdminToken ;
