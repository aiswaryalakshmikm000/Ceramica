import React, { useEffect, useState } from 'react';
import ProductView from '../../components/user/ViewProduct/ProductView';
import Navbar from '../../components/layouts/Navbar';
import Footer from '../../components/layouts/Footer';
import LoginPromptModal from '../../components/ui/LoginPromptModal';
import { useSelector } from 'react-redux';
import { selectIsUserAuthenticated } from '../../features/userAuth/userAuthSlice';

const UserViewProduct = () => {
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
      timer = setModalTimer(); 
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isAuthenticated]); 

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // If user is still not authenticated, set a new timer to reopen the modal
    if (!isAuthenticated) {
      setModalTimer();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProductView />
      <Footer />
      {!isAuthenticated && (
        <LoginPromptModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserViewProduct;