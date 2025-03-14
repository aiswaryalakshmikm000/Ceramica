
import React, { useEffect } from 'react';
import Navbar from '../../components/layouts/Navbar'
import Hero from '../../components/homepage/Hero';
import Categories from '../../components/common/Categories';
import FeaturedProducts from '../../components/homepage/FeaturedProducts';
import VideoSection from '../../components/homepage/VideoSection';
import Footer from '../../components/layouts/Footer';

const UserHome = () => {
  
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
    </div>
  );
};

export default UserHome;