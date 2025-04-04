import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layouts/Navbar'
import Hero from '../../components/user/homepage/Hero';
import Categories from '../../components/common/Categories';
import FeaturedProducts from '../../components/user/homepage/FeaturedProducts';
import VideoSection from '../../components/user/homepage/VideoSection';
import Footer from '../../components/layouts/Footer';
import LoginPromptModal from '../../components/ui/LoginPromptModal'; // Import the modal
import { useSelector } from 'react-redux';
import { selectIsUserAuthenticated } from '../../features/userAuth/userAuthSlice';

const UserHome = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  const setModalTimer = () => {
    return setTimeout(() => {
      setIsModalOpen(true);
    }, 20000); 
  };

  useEffect(() => {
    let timer;
    if (!isAuthenticated) {
      timer = setModalTimer()
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isAuthenticated]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!isAuthenticated) {
      setModalTimer();
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
        <LoginPromptModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserHome;