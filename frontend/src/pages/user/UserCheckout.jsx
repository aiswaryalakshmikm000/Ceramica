import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import Checkout from "../../components/user/checkout/Chcekout";

const UserCheckout = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Checkout />
        <Footer />
      </div>
    );
  };
  
  export default UserCheckout;