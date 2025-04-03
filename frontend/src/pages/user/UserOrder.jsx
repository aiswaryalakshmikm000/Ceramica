import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import Order from "../../components/user/order/Order";

const UserOrder = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Order />
        <Footer />
      </div>
    );
  };
  
  export default UserOrder;