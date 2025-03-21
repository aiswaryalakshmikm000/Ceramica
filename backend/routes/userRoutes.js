const express = require('express')

const authenticateToken =require('../middlewares/user/authMiddleware')

const {sendOTP,register, verifyOTP,logout, login, googleAuth, forgetPassword, refreshUserToken, verifyResetOtp, resetPassword, verifyPassword, changePassword} = require('../controllers/user/authController')
const {showCategories} =require("../controllers/user/categoryController")
const { fetchBestProducts, fetchFeaturedProducts, viewProduct,fetchProducts} =require('../controllers/user/productController')


const userRoute = express()

  
//authentication
userRoute.post('/register',register)
userRoute.post('/login',login)
userRoute.post('/logout',logout)
userRoute.post('/refreshToken',refreshUserToken)
userRoute.post('/send-otp',sendOTP)
userRoute.post('/verify-otp',verifyOTP)
// userRoute.post('/google-auth',googleAuth)

//categories
userRoute.get('/categories',showCategories)

//products
userRoute.get('/products/bestsellers',fetchBestProducts)
userRoute.get('/products/featured',fetchFeaturedProducts)
userRoute.get('/products',fetchProducts)
userRoute.get('/products/:id',viewProduct)

//forget passwords
userRoute.post('/forget-password',forgetPassword)
userRoute.post('/resend-otp',forgetPassword)
userRoute.post('/reset/verify-otp',verifyResetOtp)
userRoute.post('/reset-password',resetPassword)

//change password
userRoute.post('/verify-password/:userId',authenticateToken,verifyPassword)
userRoute.post('/change-password/:userId',authenticateToken,changePassword)


module.exports = userRoute