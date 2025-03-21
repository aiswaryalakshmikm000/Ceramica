
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Heart, ShoppingCart, Menu, X, LogOut, Search } from "lucide-react";
import Modal from "../common/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsUserAuthenticated, logoutUser } from '../../features/auth/userAuthSlice';
import { useLogoutMutation } from '../../features/auth/userApiSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      setIsLogoutModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search submitted:", searchQuery); // Debug log
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const userName = user ? `${user.name || ''}`.trim() || user.username || 'User' : '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/50 backdrop-blur-sm shadow-sm py-2" : "bg-white/50 py-3"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              Home
            </Link>
            <Link to="/shop" className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              Shop
            </Link>
            <Link to="/about" className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              About Me
            </Link>
            <Link to="/about" className="relative text-ceramic-charcoal hover:text-ceramic-earth text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-ceramic-earth after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              Contact Us
            </Link>
          </div>

          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <h1 className="text-ceramic-charcoal font-serif text-5xl font-medium">
              Ceramica
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="p-1 border rounded-l-md text-sm"
                />
                <button type="submit" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
                  <Search size={25} />
                </button>
              </form>
              {isAuthenticated ? (
                <div className="relative group">
                <div className="w-7 h-7 bg-orange-500/40 rounded-full flex items-center justify-center text-white font-medium">
                  {userInitial}
                </div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-300 text-white text-m rounded py-1 px-2 whitespace-nowrap">
                  {userName}
                </span>
              </div>
              ) : (
                <Link to="/login" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
                  <User size={25} />
                </Link>
              )}
              <Link to="/wishlist" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
                <Heart size={25} />
              </Link>
              <Link to="/cart" className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
                <ShoppingCart size={25} />
              </Link>
              {isAuthenticated && (
                <Link to="/" onClick={handleLogoutClick} className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors">
                  <LogOut size={25} />
                </Link>
              )}
            </div>
            <button
              className="md:hidden p-2 text-ceramic-charcoal"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

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
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="p-2 border rounded-md text-sm w-full"
                />
                <button type="submit" className="p-2 text-ceramic-charcoal">
                  <Search size={20} />
                </button>
              </form>
              <div className="flex items-center justify-around pt-4">
                {isAuthenticated ? (
                  <span className="text-ceramic-charcoal font-medium">
                    {userName}
                  </span>
                ) : (
                  <Link to="/login" className="p-2 text-ceramic-charcoal">
                    <User size={20} />
                  </Link>
                )}
                <Link to="/wishlist" className="p-2 text-ceramic-charcoal">
                  <Heart size={20} />
                </Link>
                <Link to="/cart" className="p-2 text-ceramic-charcoal">
                  <ShoppingCart size={20} />
                </Link>
                {isAuthenticated && (
                  <Link to="/" onClick={handleLogoutClick} className="p-2 text-ceramic-charcoal">
                    <LogOut size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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