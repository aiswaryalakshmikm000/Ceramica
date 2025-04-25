import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layouts/Navbar'
import Hero from '../../components/user/homepage/Hero';
import Categories from '../../components/common/Categories';
import FeaturedProducts from '../../components/user/homepage/FeaturedProducts';
import VideoSection from '../../components/user/homepage/VideoSection';
import Footer from '../../components/layouts/Footer';
import LoginPromptModal from '../../components/ui/LoginPromptModal'; 
import ReferralModal from '../../components/user/referAndEarn/ReferralModal';
import { Gift } from "lucide-react";
import { useSelector } from 'react-redux';
import { selectIsUserAuthenticated, selectUser } from '../../features/userAuth/userAuthSlice';


const UserHome = () => {
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const user = useSelector(selectUser)
console.log("$######### user", user)


  const setLoginModalTimer = () => {
    return setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 20000); 
  };

  useEffect(() => {
    let timer;
    if (!isAuthenticated) {
      timer = setLoginModalTimer()
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isAuthenticated]);

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    if (!isAuthenticated) {
      setLoginModalTimer();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <VideoSection />
      </main>
      <Footer />
      {!isAuthenticated && (
        <LoginPromptModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
      )}
      {isAuthenticated && !user.referredBy &&(
        <>
          <button
            onClick={() => setIsReferralModalOpen(true)}
            className="fixed bottom-8 left-8 bg-orange-800 text-white p-3 rounded-full shadow-lg hover:bg-orange-900 transition-colors z-50"
          >
            <Gift size={24} />
          </button>
          <ReferralModal
            isOpen={isReferralModalOpen}
            onClose={() => setIsReferralModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default UserHome;