import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Heart, ShoppingCart, Menu, X, LogOut, Search, AlignLeft } from "lucide-react";
import Modal from "../common/Modal";
import Sidebar from "./Sidebar";
import CartSidebar from "./CartSidebar"; 
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsUserAuthenticated, logoutUser } from "../../features/userAuth/userAuthSlice";
import { useLogoutMutation } from "../../features/userAuth/userApiSlice";
import { googleLogout } from "@react-oauth/google";
import { toast } from "react-toastify";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  useEffect(() => {
  }, [user]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const logoutResult = await logout().unwrap();
      dispatch(logoutUser());
      googleLogout();
      setIsLogoutModalOpen(false);
      navigate("/", { replace: true });
      toast.success(logoutResult.message || "Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLogoutModalOpen(false);
      toast.error(error?.data?.message || "Logout failed. Please try again.");
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const userName = user ? `${user.name || ""}`.trim() || user.username || "User" : "";
  const userImage = user?.images;

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-sm shadow-sm py-2" : "bg-white/90 py-3"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-18">
        <nav className="flex items-center justify-between">
          {/* Left Section: Sidebar Toggle and Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="text-gray-800 hover:text-orange-600 transition-colors"
                aria-label="Open sidebar menu"
              >
                <AlignLeft size={22} />
              </button>
            )}
            <Link
              to="/"
              className="relative text-gray-800 hover:text-orange-600 text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-orange-600 after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="relative text-gray-800 hover:text-orange-600 text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-orange-600 after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="relative text-gray-800 hover:text-orange-600 text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-orange-600 after:left-0 after:bottom-[-4px] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              About Me
            </Link>
          </div>

          {/* Center Section: Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-gray-800 font-serif text-2xl sm:text-3xl lg:text-4xl">Ceramica</h1>
          </Link>

          {/* Right Section: Search, User, Wishlist, Cart, Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="p-1.5 border rounded-l-md text-sm w-32 lg:w-40 focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button
                  type="submit"
                  className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
              {isAuthenticated && user ? (
                <div className="relative group">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={userImage}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150?text=User";
                      }}
                    />
                  </div>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap hidden">
                    {userName}
                  </span>
                </div>
              ) : (
                <Link to="/login" className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors">
                  <User size={20} />
                </Link>
              )}
              {isAuthenticated ? (
                <Link 
                  to={`/wishlist/${user}`} 
                  className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors"
                >
                  <Heart size={20} />
                </Link>
              ) : (
                <Link 
                  to="/wishlist" 
                  className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors"
                >
                  <Heart size={20} />
                </Link>
              )}
              <button
                onClick={toggleCart}
                className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart size={20} />
              </button>
              {isAuthenticated && (
                <Link
                  to="/"
                  onClick={handleLogoutClick}
                  className="p-1.5 text-gray-800 hover:text-orange-600 transition-colors"
                >
                  <LogOut size={20} />
                </Link>
              )}
            </div>
            <button className="md:hidden p-2 text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {isAuthenticated && (
                <button
                  onClick={toggleSidebar}
                  className="flex items-center space-x-2 text-gray-800 py-2 border-b border-gray-200"
                >
                  <AlignLeft size={18} />
                  <span>My Account</span>
                </button>
              )}
              <Link to="/" className="text-gray-800 py-2 border-b border-gray-200">
                Home
              </Link>
              <Link to="/shop" className="text-gray-800 py-2 border-b border-gray-200">
                Shop
              </Link>
              <Link to="/about" className="text-gray-800 py-2 border-b border-gray-200">
                About Me
              </Link>
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="p-2 border rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button type="submit" className="p-2 text-gray-800">
                  <Search size={20} />
                </button>
              </form>
              <div className="flex items-center justify-around pt-3">
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-orange-500">
                      <img
                        src={userImage}
                        alt={userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=User";
                        }}
                      />
                    </div>
                    <span className="text-gray-800 font-medium text-sm">{userName}</span>
                  </div>
                ) : (
                  <Link to="/login" className="p-2 text-gray-800">
                    <User size={20} />
                  </Link>
                )}
                {isAuthenticated ? (
                  <Link 
                    to={`/wishlist/${user}`} 
                    className="p-2 text-gray-800"
                  >
                    <Heart size={20} />
                  </Link>
                ) : (
                  <Link 
                    to="/wishlist" 
                    className="p-2 text-gray-800"
                  >
                    <Heart size={20} />
                  </Link>
                )}
                <button onClick={toggleCart} className="p-2 text-gray-800">
                  <ShoppingCart size={20} />
                </button>
                {isAuthenticated && (
                  <Link to="/" onClick={handleLogoutClick} className="p-2 text-gray-800">
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

    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
  </>
);
};

export default Navbar;


