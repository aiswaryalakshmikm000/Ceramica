
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Set page title
    document.title = "Page Not Found | Ceramica";
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-ceramic-beige/50 py-20">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-7xl font-serif font-medium mb-4 text-ceramic-earth">404</h1>
          <p className="text-xl text-ceramic-charcoal mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-ceramic-clay text-white px-8 py-3 rounded-full hover:bg-ceramic-terracotta transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;