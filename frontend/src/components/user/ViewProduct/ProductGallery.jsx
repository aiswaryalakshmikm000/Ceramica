import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Badge from '../.././ui/Badge';

const ProductGallery = ({ images, isNew, discount }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: '50%', y: '50%' });
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const mainImageRef = useRef(null);

  useEffect(() => {
    // Preload images
    const preloadImages = () => {
      const loadedStates = Array(images.length).fill(false);
      images.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImagesLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        };
      });
      return loadedStates;
    };
    
    setImagesLoaded(preloadImages());
  }, [images]);

  const handleZoom = (e) => {
    if (!mainImageRef.current) return;
    
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x: `${x}%`, y: `${y}%` });
  };

  const handleMouseEnter = () => {
    setZoomed(true);
  };

  const handleMouseLeave = () => {
    setZoomed(false);
    setZoomPosition({ x: '50%', y: '50%' }); 
  };
  
  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setZoomed(false);
  };
  
  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomed(false);
  };
  
  const selectImage = (index) => {
    setActiveIndex(index);
    setZoomed(false);
  };

  return (
    <div className="w-full lg:w-1/2 animate-fade-in">
      <div 
        className="relative rounded-lg overflow-hidden mb-4 product-zoom-container h-[400px] md:h-[500px]"
        onMouseMove={handleZoom} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={mainImageRef}
      >
        {/* Main Image */}
        <img 
          src={images[activeIndex]} 
          alt={`Product view ${activeIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-100 ${zoomed ? 'zoomed' : ''} ${imagesLoaded[activeIndex] ? 'image-loaded' : 'image-loading'}`}
          style={{ 
            transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
            transform: zoomed ? 'scale(2)' : 'scale(1)',
          }}
        />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge variant="new" className="animate-fade-in">
              NEW
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="discount" className="animate-fade-in">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Zoom Icon */}
        <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md
                     text-ceramic-dark opacity-70 hover:opacity-100 transition-opacity duration-300">
          <ZoomIn size={20} />
        </div>
        
        {/* Navigation Arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm 
                   rounded-full shadow-md text-ceramic-dark opacity-0 group-hover:opacity-90 
                   transition-opacity duration-300 hover:bg-ceramic-accent hover:text-white"
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm 
                   rounded-full shadow-md text-ceramic-dark opacity-0 group-hover:opacity-90
                   transition-opacity duration-300 hover:bg-ceramic-accent hover:text-white"
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Badges */}
        {isNew && <div className="badge-new animate-fade-in">NEW</div>}
        {discount > 0 && <div className="badge-discount animate-fade-in">{discount}% OFF</div>}
      </div>
      
      {/* Thumbnail Strip */}
      <div className="flex space-x-2 mt-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`relative w-24 h-24 rounded-md overflow-hidden cursor-pointer transition-all duration-300 
                     ${activeIndex === index ? 'ring-2 ring-ceramic-accent ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => selectImage(index)}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`} 
              className={`w-full h-full object-cover ${imagesLoaded[index] ? 'image-loaded' : 'image-loading'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;