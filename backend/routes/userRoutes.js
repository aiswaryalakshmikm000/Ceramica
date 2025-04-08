const express = require('express')
const upload =require('../config/multerConfig')

const authenticateToken =require('../middlewares/user/authMiddleware')

const { sendOTP, checkAuth, register, verifyOTP,logout, login, forgetPassword, refreshUserToken, verifyResetOtp, resetPassword, verifyPassword, changePassword} = require('../controllers/user/authController')
const { googleAuth } = require("../controllers/user/googleController")
const {showCategories} =require("../controllers/user/categoryController")
const { fetchBestProducts, fetchFeaturedProducts, viewProduct,fetchProducts} =require('../controllers/user/productController')
const {showProfile, editProfile} =require('../controllers/user/userController')
const {addAddress, showAddresses, editAddress, deleteAddress, setDefaultAddress} = require('../controllers/user/addressController')
const {checkoutValidation, addToCart, showCart, updateCart, removeItemFromCart} = require('../controllers/user/cartController')
const {updateWishlistItem, removeWishlistItem, getWishlist, toggleWishlistItem} = require("../controllers/user/wishlistController");
const {placeOrder, getUserOrders, getOrderById, cancelOrder, cancelOrderItem, returnOrder, returnOrderItem, downloadInvoice} = require("../controllers/user/orderController");


const userRoute = express()

userRoute.get('/check-auth', authenticateToken, checkAuth);

//authentication
userRoute.post('/register', upload.single('image'), register)
userRoute.post('/login',login)
userRoute.post('/logout',logout)
userRoute.post('/refreshToken',refreshUserToken)
userRoute.post('/send-otp',sendOTP)
userRoute.post('/verify-otp',verifyOTP)
userRoute.post('/google-auth', googleAuth)

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

//profile
userRoute.get('/profile/:id', authenticateToken, showProfile);
userRoute.put('/profile/:id', authenticateToken, upload.single('image'), editProfile);

//address
userRoute.post('/addresses/:userId', authenticateToken, addAddress);
userRoute.get('/addresses/:userId', authenticateToken, showAddresses);
userRoute.put('/address/:userId/:addressId', authenticateToken, editAddress)
userRoute.delete('/address/:userId/:addressId', authenticateToken, deleteAddress)
userRoute.put('/address/:addressId/set-default', authenticateToken, setDefaultAddress)

//cart
userRoute.post('/cart/:userId/add', authenticateToken, addToCart);
userRoute.get('/cart/:userId',authenticateToken, showCart);
userRoute.put('/cart/:userId/update', authenticateToken, updateCart)
userRoute.delete('/cart/:userId/remove', authenticateToken, removeItemFromCart)
userRoute.get('/checkout', authenticateToken, checkoutValidation);

//wishlist
userRoute.post('/wishlist/:userId/toggle', authenticateToken, toggleWishlistItem);
userRoute.delete('/wishlist/:userId/remove', authenticateToken, removeWishlistItem);
userRoute.put('/wishlist/:userId/update', authenticateToken, updateWishlistItem);
userRoute.get('/wishlist/:userId', authenticateToken, getWishlist);

//order
userRoute.get('/orders', authenticateToken, getUserOrders);
userRoute.get('/orders/:orderId', authenticateToken, getOrderById);
userRoute.post('/orders', authenticateToken, placeOrder);
userRoute.put('/orders/:orderId/cancel', authenticateToken, cancelOrder);
userRoute.put('/orders/:orderId/return', authenticateToken, returnOrder);
userRoute.get('/orders/:orderId/invoice', authenticateToken, downloadInvoice);
userRoute.post('/orders/cancel-item', authenticateToken, cancelOrderItem);
userRoute.post('/orders/return-item', authenticateToken, returnOrderItem);

module.exports = userRoute