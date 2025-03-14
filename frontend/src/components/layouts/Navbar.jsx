
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/50 backdrop-blur-sm shadow-sm py-2' 
          : 'bg-white/50 py-3'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="link-underline text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              Home
            </Link>
            <Link to="/shop" className="link-underline text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              Shop
            </Link>
            <Link to="/about" className="link-underline text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              About Me
            </Link>
            <Link to="/about" className="link-underline text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-ceramic-charcoal font-serif text-2xl font-medium">
              Ceramica
            </h1>
          </Link>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              <Search size={20} />
            </button>
            <Link to="/login" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              <User size={20} />
            </Link>
            <Link to="/wishlist" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
              <ShoppingCart size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-ceramic-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-ceramic-charcoal py-2 border-b border-ceramic-beige">
                Home
              </Link>
              <Link to="/shop" className="text-ceramic-charcoal py-2 border-b border-ceramic-beige">
                Shop
              </Link>
              <Link to="/about" className="text-ceramic-charcoal py-2 border-b border-ceramic-beige">
                About Me
              </Link>
              <div className="flex items-center justify-around pt-4">
                <button className="p-2 text-ceramic-charcoal">
                  <Search size={20} />
                </button>
                <Link to="/login" className="p-2 text-ceramic-charcoal">
                  <User size={20} />
                </Link>
                <Link to="/wishlist" className="p-2 text-ceramic-charcoal">
                  <Heart size={20} />
                </Link>
                <Link to="/cart" className="p-2 text-ceramic-charcoal">
                  <ShoppingCart size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
