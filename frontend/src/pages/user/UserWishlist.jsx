import Wishlist from "../../components/user/wishlist/Wishlist";
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserWishlist = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Wishlist />
        <Footer />
      </div>
    );
  };
  
  export default UserWishlist;