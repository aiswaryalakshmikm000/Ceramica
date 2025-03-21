
import React, { useEffect } from 'react';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import UserForgetPasswordPage from '../../components/user/UserForgetPasswordPage';


const UserForgetPassword = () => {
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <UserForgetPasswordPage />
      </main>
      <Footer />
    </div>
  );
};

export default UserForgetPassword;