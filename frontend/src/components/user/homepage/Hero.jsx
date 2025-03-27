import React, { useEffect, useRef, useState } from 'react';
import banner1 from "../../../assets/Banners/banner1.jpg";
import banner2 from "../../../assets/Banners/banner2.jpg";
import banner3 from "../../../assets/Banners/banner3.jpg";

const Banners = [
  {
    backgroundImage: banner1,
    title: 'Handcrafted Ceramics',
    subtitle: 'Discover our collection of artisanal ceramic pieces, each uniquely crafted with care and precision.',
    ctaText: 'Shop Collection',
    ctaLink: '/shop'
  },
  {
    backgroundImage: banner2,
    title: 'Rustic Pottery Collection',
    subtitle: 'Explore our earthy, hand-thrown pottery perfect for adding warmth to your home.',
    ctaText: 'Shop Collection',
    ctaLink: '/shop'
  },
  {
    backgroundImage: banner3,
    title: 'Modern Ceramic Art',
    subtitle: 'Experience contemporary ceramic designs that blend functionality with artistic expression.',
    ctaText: 'Shop Collection',
    ctaLink: '/shop'
  }
];

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (Banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % Banners.length);
      }, 10000); 

      return () => clearInterval(interval);
    }
  }, []);

  const banner = Banners[currentBanner];

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;

    if (title) {
      title.style.opacity = "0";
      title.style.transform = "translateY(20px)";
      setTimeout(() => {
        title.style.transition = "opacity 1.2s ease, transform 1.2s ease";
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
      }, 300);
    }

    if (subtitle) {
      subtitle.style.opacity = "0";
      subtitle.style.transform = "translateY(20px)";
      setTimeout(() => {
        subtitle.style.transition = "opacity 1.2s ease, transform 1.2s ease";
        subtitle.style.opacity = "1";
        subtitle.style.transform = "translateY(0)";
      }, 600);
    }

    if (cta) {
      cta.style.opacity = "0";
      setTimeout(() => {
        cta.style.transition = "opacity 1.2s ease";
        cta.style.opacity = "1";
      }, 900);
    }
  }, [currentBanner]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${banner.backgroundImage})`,
          filter: "brightness(0.9)",
          transition: "background-image 1s ease-in-out"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-ceramic-charcoal/30"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <div ref={titleRef} className="mb-6">
            <h1 className="text-white font-serif text-5xl md:text-6xl lg:text-7xl leading-tight">
              {banner.title}
            </h1>
          </div>
          
          <div ref={subtitleRef} className="mb-8">
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              {banner.subtitle}
            </p>
          </div>
          
          <div ref={ctaRef}>
            <a 
              href={banner.ctaLink} 
              className="inline-block bg-ceramic-clay text-white font-medium px-8 py-3 rounded-full transition-all duration-300 hover:bg-ceramic-terracotta hover:shadow-lg"
            >
              {banner.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;