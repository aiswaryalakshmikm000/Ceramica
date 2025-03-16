const express = require('express')
const upload =require('../config/multerConfig')

const authenticateAdminToken = require('../middlewares/admin/adminAuthMiddleware')

const {login, logout, register, refreshAccessToken} = require('../controllers/admin/adminController')
const {getCustomerDetails,editCustomerStatus,} = require('../controllers/admin/userController')
const{addCategory,showCategories,editCategory,listCategory,showCategory} = require('../controllers/admin/categoryController')
const {addProduct,showProducts,updateProductStatus, showProduct, editProduct} = require('../controllers/admin/productController')

const adminRoute = express()

//admin
adminRoute.post('/register',register)
adminRoute.post('/login',login)
adminRoute.post('/logout',logout)
adminRoute.post('/refreshToken',refreshAccessToken)

//customers
adminRoute.get('/customers',authenticateAdminToken,getCustomerDetails)
adminRoute.patch('/customers/:userId',authenticateAdminToken,editCustomerStatus)

//category
adminRoute.post('/categories',authenticateAdminToken,addCategory)
adminRoute.get('/categories',authenticateAdminToken,showCategories)
adminRoute.put('/categories/:catId',authenticateAdminToken,editCategory)
adminRoute.get('/categories/:catId',authenticateAdminToken,showCategory)
adminRoute.patch('/categories/list/:categoryId',authenticateAdminToken,listCategory)

//products
// adminRoute.post('/products', authenticateAdminToken,upload.array('images',4),addProduct) // Accept up to 4 images
adminRoute.post( '/products', upload.fields(Array.from({ length: 10 }, (_, i) => ({ name: `color${i}Images`, maxCount: 4 }))), authenticateAdminToken, addProduct );
adminRoute.get('/products',authenticateAdminToken,showProducts)
adminRoute.patch('/products/:id', authenticateAdminToken,updateProductStatus)
adminRoute.get('/products/:_id',authenticateAdminToken,showProduct)
adminRoute.put('/products/:_id',authenticateAdminToken,upload.array('images',4),editProduct) // Accept up to 4 images


module.exports = adminRoute


