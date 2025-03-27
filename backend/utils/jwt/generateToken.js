const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const tokenKey = process.env.TOKEN_KEY;
const accessExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY; 
const refreshExpiration = process.env.REFRESH_TOKEN_EXPIRATION;

const adminTokenKey = process.env.ADMIN_TOKEN_KEY;
const adminAccessExpiration = process.env.ADMIN_ACCESS_TOKEN_EXPIRATION;
const adminRefreshTokenKey=process.env.ADMIN_REFRESH_TOKEN_KEY
const adminRefreshExpiration = process.env.ADMIN_REFRESH_TOKEN_EXPIRATION;

const generateAccessToken = (user) => {
    if (user?.role === 'user') {
        console.log("Generating access token for user");
        return jwt.sign({ user }, tokenKey, { expiresIn: accessExpiration });
    }
    console.log("Generating access token for admin");
    return jwt.sign({ user }, adminTokenKey, { expiresIn: adminAccessExpiration });
};

const generateRefreshToken = (user) => {
    if (user?.role === 'user') {
        console.log("Generating refresh token for user");
        return jwt.sign({ user }, refreshTokenKey, { expiresIn: refreshExpiration });
    }
    console.log("Generating refresh token for admin");
    return jwt.sign({ user }, adminRefreshTokenKey, { expiresIn: adminRefreshExpiration });
};



module.exports = { generateAccessToken, generateRefreshToken };