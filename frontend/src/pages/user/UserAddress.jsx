import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import Address from "../../components/user/address/Address";

const UserAddress = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Address />
        <Footer />
      </div>
    );
  };
  
  export default UserAddress;