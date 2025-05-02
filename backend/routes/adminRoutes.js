const express = require('express')
const upload =require('../config/multerConfig')

const authenticateAdminToken = require('../middlewares/admin/adminAuthMiddleware')

const {  login, logout, register, refreshAccessToken, checkAuth} = require('../controllers/admin/adminController')
const {getCustomerDetails,editCustomerStatus,} = require('../controllers/admin/userController')
const{addCategory,showCategories,editCategory,listCategory,showCategory} = require('../controllers/admin/categoryController')
const {addProduct,showProducts,updateProductStatus, showProduct, editProduct} = require('../controllers/admin/productController')
const {getAllOrders, updateOrderStatus, verifyReturnRequest, verifyItemReturnRequest, getOrderDetails} = require('../controllers/admin/oderController');
const { createCoupon, getCoupons, deleteCoupon, } = require("../controllers/admin/couponController");
const {getOffers, addOffer, updateOffer, statusToggle } = require("../controllers/admin/offerController");
const { getSalesReport, downloadExcelReport, downloadPdfReport } = require("../controllers/admin/salesReportController");
const {getStatus, getSales, getTopProducts, getTopCategories, } = require ('../controllers/admin/dashboardController')
const { getAdminWallet, getWalletTransactions } = require("../controllers/admin/adminWalletController");

const adminRoute = express()

adminRoute.get('/check-auth', authenticateAdminToken, checkAuth);

//admin
adminRoute.post('/register',register)
adminRoute.post('/login',login)
adminRoute.post('/logout',logout)
adminRoute.post('/refreshToken',refreshAccessToken)

//customers
adminRoute.get('/customers',authenticateAdminToken,getCustomerDetails)
adminRoute.patch('/customers/:userId',authenticateAdminToken,editCustomerStatus)

//category
adminRoute.post('/categories',authenticateAdminToken, upload.single('image'), addCategory)
adminRoute.get('/categories',authenticateAdminToken,showCategories)
adminRoute.put('/categories/:catId',authenticateAdminToken, upload.single('image'), editCategory)
adminRoute.get('/categories/:catId',authenticateAdminToken,showCategory)
adminRoute.patch('/categories/list/:categoryId',authenticateAdminToken,listCategory)

//products
adminRoute.post( '/products', upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `color${i}Images`, maxCount: 4 }))), authenticateAdminToken, addProduct );
adminRoute.get('/products',authenticateAdminToken,showProducts)
adminRoute.patch('/products/:id', authenticateAdminToken,updateProductStatus)
adminRoute.get('/products/:_id',authenticateAdminToken,showProduct)
adminRoute.put('/products/:_id', authenticateAdminToken, upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `color${i}Images`, maxCount: 4 }))), editProduct );

//order
adminRoute.get('/orders', authenticateAdminToken, getAllOrders)
adminRoute.put('/orders/:orderId/status', authenticateAdminToken, updateOrderStatus)
adminRoute.put('/orders/:orderId/return', authenticateAdminToken, verifyReturnRequest)
adminRoute.put('/orders/:orderId/return-item', authenticateAdminToken, verifyItemReturnRequest);
adminRoute.get('/orders/:orderId', authenticateAdminToken, getOrderDetails)


//coupon
adminRoute.get("/coupons", authenticateAdminToken, getCoupons);
adminRoute.post("/coupons/add-coupon", authenticateAdminToken, createCoupon);
adminRoute.delete("/coupons/:couponId", authenticateAdminToken, deleteCoupon);

//offer
adminRoute.get('/offers', authenticateAdminToken, getOffers);
adminRoute.post('/offers/add', authenticateAdminToken,  addOffer);
adminRoute.put('/offers/:id', authenticateAdminToken, updateOffer);
adminRoute.patch('/offers/:id', authenticateAdminToken, statusToggle);

//sales report
adminRoute.get('/sales-report', authenticateAdminToken, getSalesReport);
adminRoute.get('/sales-report/download/excel', authenticateAdminToken, downloadExcelReport);
adminRoute.get('/sales-report/download/pdf', authenticateAdminToken, downloadPdfReport);


//dashboard
adminRoute.get('/dashboard/status', authenticateAdminToken, getStatus);
adminRoute.get('/dashboard/sales', authenticateAdminToken, getSales);
adminRoute.get('/dashboard/top-products', authenticateAdminToken, getTopProducts);
adminRoute.get('/dashboard/top-categories', authenticateAdminToken, getTopCategories);

//wallet
adminRoute.get("/wallet", authenticateAdminToken, getAdminWallet);
adminRoute.get("/wallet/transactions", authenticateAdminToken, getWalletTransactions);


module.exports = adminRoute


