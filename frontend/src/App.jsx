import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import UserRegister from "./pages/user/UserRegister.jsx";
import UserLogin from "./pages/user/UserLogin.jsx";
import UserHome from "./pages/user/UserHome";
import UserShop from "./pages/user/UserShop";
import ScrollToTop from "./components/common/ScrollToTop";
import NotFound from "./pages/NotFound";
import UserViewProduct from "./pages/user/UserViewProduct";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";

// import UserTokenRefresher from "./routes/UserTokenRefresher";
// import AdminTokenRefresher from "./routes/AdminTokenRefresher";

import './index.css'

import AdminLogin from "./components/admin/AdminLogin"
import AdminRegister from "./components/admin/AdminRegister";
import AdminAddProductPage from "./components/admin/AdminAddProduct";
import AdminEditProductPage from "./components/admin/AdminEditProduct";
import AdminShowProductsPage from "./components/admin/AdminShowProducts";
import AdminCategoryManagement from "./components/admin/AdminCategoryManagement.jsx"
import AdminShowCustomers from "./components/admin/AdminShowCustomers.jsx";



function App() {
  return (
    <Router>
      {/* Ensure Token Refreshers are always active */}
      {/* <UserTokenRefresher />
      <AdminTokenRefresher /> */}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserHome />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/shop" element={<UserShop />} />
         <Route path="/shop/:id" element={<UserViewProduct />} />
        {/* <Route path="user/home" element={<Home />} /> */}

        
        
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/products/add" element={<AdminAddProductPage />} />
        <Route path="/admin/products/edit/:id" element={<AdminEditProductPage />} />
        <Route path="/admin/products" element={<AdminShowProductsPage />} />
        <Route path="/admin/categories" element={<AdminCategoryManagement />} />
        <Route path="/admin/customers" element={<AdminShowCustomers />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />




        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
