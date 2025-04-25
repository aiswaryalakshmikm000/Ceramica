import ReferAndEarn from "../../components/user/referAndEarn/ReferAndEarn";
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserProfile = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <ReferAndEarn />
        <Footer />
      </div>
    );
  };
  
  export default UserProfile;