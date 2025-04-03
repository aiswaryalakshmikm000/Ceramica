import Footer from "../../components/layouts/Footer";
import Navbar from "../../components/layouts/Navbar"
import Wallet from "../../components/user/wallet/Wallet";


const UserWallet = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Wallet />
        <Footer />
      </div>
    );
  };
  
  export default UserWallet;