import Cart from "../../components/user/cart/Cart";
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserCart = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Cart />
        <Footer />
      </div>
    );
  };
  
  export default UserCart;