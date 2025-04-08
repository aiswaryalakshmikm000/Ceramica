import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import OrderDetailPage from "../../components/user/order/OrderDetailPage";

const UserViewOrder = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <OrderDetailPage />
        <Footer />
      </div>
    );
  };
  
  export default UserViewOrder;