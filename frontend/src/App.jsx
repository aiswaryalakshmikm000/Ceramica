import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./components/user/UserRegister";
import UserLogin from "./components/user/UserLogin";
import UserHome from "./pages/user/UserHome";
import UserShop from "./pages/user/UserShop";
import ScrollToTop from "./components/common/ScrollToTop";

// import UserTokenRefresher from "./routes/UserTokenRefresher";
// import AdminTokenRefresher from "./routes/AdminTokenRefresher";

import './index.css'

import AdminLogin from "./components/admin/AdminLogin"
import AdminRegister from "./components/admin/AdminRegister";

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
        {/* <Route path="user/home" element={<Home />} /> */}

        

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
