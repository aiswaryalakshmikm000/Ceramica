import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { User, Heart, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import Modal from "../common/Modal"; // Import the Modal component

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state for modal
  const navigate = useNavigate(); // For navigation after logout

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    setIsLogoutModalOpen(true); // Open confirmation modal
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    // Here you would typically handle logout logic (e.g., clear auth token)
    navigate("/"); // Navigate to home page after confirmation
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-sm shadow-sm py-2"
          : "bg-white/50 py-3"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Left: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              About Me
            </Link>
            <Link
              to="/about"
              className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Contact Us
            </Link>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <h1 className="text-ceramic-charcoal font-serif text-5xl font-medium">
              Ceramica
            </h1>
          </Link>

          {/* Right: Icons and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
              >
                <User size={25} />
              </Link>
              <Link
                to="/wishlist"
                className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
              >
                <Heart size={25} />
              </Link>
              <Link
                to="/cart"
                className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
              >
                <ShoppingCart size={25} />
              </Link>
              <Link
                to="/logout"
                onClick={handleLogoutClick}
                className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
              >
                <LogOut size={25} />
              </Link>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-ceramic-charcoal"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-ceramic-charcoal py-2 border-b border-ceramic-beige"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-ceramic-charcoal py-2 border-b border-ceramic-beige"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-ceramic-charcoal py-2 border-b border-ceramic-beige"
              >
                About Me
              </Link>
              <div className="flex items-center justify-around pt-4">
                <Link to="/login" className="p-2 text-ceramic-charcoal">
                  <User size={20} />
                </Link>
                <Link to="/wishlist" className="p-2 text-ceramic-charcoal">
                  <Heart size={20} />
                </Link>
                <Link to="/cart" className="p-2 text-ceramic-charcoal">
                  <ShoppingCart size={20} />
                </Link>
                <Link
                  to="/logout"
                  onClick={handleLogoutClick}
                  className="p-2 text-ceramic-charcoal"
                >
                  <LogOut size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </header>
  );
};

export default Navbar;