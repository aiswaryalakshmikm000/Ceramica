import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./components/user/UserRegister";
import UserLogin from "./components/user/UserLogin";
import UserHome from "./pages/user/UserHome";
import UserShop from "./pages/user/UserShop";
import ScrollToTop from "./components/common/ScrollToTop";
import NotFound from "./pages/NotFound";
import UserViewProduct from "./pages/user/UserViewProduct";

// import UserTokenRefresher from "./routes/UserTokenRefresher";
// import AdminTokenRefresher from "./routes/AdminTokenRefresher";

import './index.css'

import AdminLogin from "./components/admin/AdminLogin"
import AdminRegister from "./components/admin/AdminRegister";
import AdminAddProductPage from "./components/admin/AdminAddProduct";
import AdminEditProductPage from "./components/admin/AdminEditProduct";
import AdminShowProductsPage from "./components/admin/AdminShowProducts";
import AdminShowCategoriesPage from "./components/admin/CategoryManagement";




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
        <Route path="/admin/categories" element={<AdminShowCategoriesPage />} />



        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
