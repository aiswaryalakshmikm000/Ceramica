import EditProfile from "../../components/user/ProfileDetails/EditProfile"
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserEditProfile = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <EditProfile />
        <Footer />
      </div>
    );
  };
  
  export default UserEditProfile;