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

//categories
userRoute.get('/categories',showCategories)

//products
userRoute.get('/products/featured',fetchFeaturedProducts)
userRoute.get('/products',fetchProducts)
userRoute.get('/products/:id',viewProduct)


module.exports = userRoute