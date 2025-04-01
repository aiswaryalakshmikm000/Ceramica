import Profile from "../../components/user/ProfileDetails/Profile";
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserProfile = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <Profile />
        <Footer />
      </div>
    );
  };
  
  export default UserProfile;