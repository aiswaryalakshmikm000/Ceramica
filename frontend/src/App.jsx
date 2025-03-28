import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Removed Suspense, lazy from here
import { Suspense, lazy } from "react"; // Correct import for Suspense and lazy
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import AuthInitializer from "./services/AuthInitializer.jsx";


// Lazy-loaded components
const UserRegister = lazy(() => import("./pages/user/UserRegister.jsx"));
const UserLogin = lazy(() => import("./pages/user/UserLogin.jsx"));
const UserHome = lazy(() => import("./pages/user/UserHome"));
const UserShop = lazy(() => import("./pages/user/UserShop"));
const UserViewProduct = lazy(() => import("./pages/user/UserViewProduct"));
const UserForgetPassword = lazy(() => import("./pages/user/UserForgetPasswrod.jsx"));

const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminRegister = lazy(() => import("./components/admin/AdminRegister"));
const AdminAddProductPage = lazy(() => import("./components/admin/product/AdminAddProduct"));
const AdminEditProductPage = lazy(() => import("./components/admin/product/AdminEditProduct"));
const AdminShowProductsPage = lazy(() => import("./components/admin/product/AdminShowProducts.jsx"));
const AdminCategoryManagement = lazy(() => import("./components/admin/category/AdminCategoryManagement.jsx"));
const AdminShowCustomers = lazy(() => import("./components/admin/customer/AdminShowCustomers.jsx"));
const AdminDashboard = lazy(() => import("./components/admin/dashboard/AdminDashboard.jsx"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Non-lazy-loaded components (lightweight)
import ScrollToTop from "./components/common/ScrollToTop";
import { IsUserLogin, IsUserLogout, IsAdminLogin, IsAdminLogout } from './routes/ProtectedRoutes';

// Loading Spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <AuthInitializer>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public User Routes */}
          <Route path="/" element={<UserHome />} />
          <Route path="/register" element={<IsUserLogout><UserRegister /></IsUserLogout>} />
          <Route path="/login" element={<IsUserLogout><UserLogin /></IsUserLogout>} />
          <Route path="/forgot-password" element={<IsUserLogout><UserForgetPassword /></IsUserLogout>} />
          <Route path="/shop" element={<UserShop />} /> {/* Made public */}
          <Route path="/shop/:id" element={<UserViewProduct />} /> {/* Made public */}

          {/* Protected User Routes (Commented as in your code) */}
          {/* <Route path="/cart" element={<IsUserLogin><UserViewProduct /></IsUserLogin>} /> */}
          {/* <Route path="/checkout" element={<IsUserLogin><UserViewProduct /></IsUserLogin>} /> */}
          {/* <Route path="/wishlist" element={<IsUserLogin><UserViewProduct /></IsUserLogin>} /> */}
          {/* <Route path="/order" element={<IsUserLogin><UserViewProduct /></IsUserLogin>} /> */}

          {/* Public Admin Routes */}
          <Route path="/admin/register" element={<IsAdminLogout><AdminRegister /></IsAdminLogout>} />
          <Route path="/admin/login" element={<IsAdminLogout><AdminLogin /></IsAdminLogout>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/products/add" element={<IsAdminLogin><AdminAddProductPage /></IsAdminLogin>} />
          <Route path="/admin/products/edit/:id" element={<IsAdminLogin><AdminEditProductPage /></IsAdminLogin>} />
          <Route path="/admin/products" element={<IsAdminLogin><AdminShowProductsPage /></IsAdminLogin>} />
          <Route path="/admin/categories" element={<IsAdminLogin><AdminCategoryManagement /></IsAdminLogin>} />
          <Route path="/admin/customers" element={<IsAdminLogin><AdminShowCustomers /></IsAdminLogin>} />
          <Route path="/admin/dashboard" element={<IsAdminLogin><AdminDashboard /></IsAdminLogin>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthInitializer>
    </Router>
  );
}

export default App;