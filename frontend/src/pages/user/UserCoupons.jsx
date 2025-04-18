import Coupons from "../../components/user/coupons/UserCoupon";
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserCoupons = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Coupons />
        <Footer />
      </div>
    );
  };
  
  export default UserCoupons;