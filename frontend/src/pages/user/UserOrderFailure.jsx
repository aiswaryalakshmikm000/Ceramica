import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import OrderFailure from "../../components/user/checkout/OrderFailure";

const UserOrderFailure = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <OrderFailure />
        <Footer />
      </div>
    );
  };
  
  export default UserOrderFailure;