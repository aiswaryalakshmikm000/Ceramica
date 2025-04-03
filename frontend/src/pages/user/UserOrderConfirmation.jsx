import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import OrderConfirmation from "../../components/user/checkout/OrderConfirmation";

const UserOrderConfirmation = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <OrderConfirmation />
        <Footer />
      </div>
    );
  };
  
  export default UserOrderConfirmation;