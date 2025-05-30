
import UserLoginPage from "../../components/user/UserLoginPage"
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserLogin = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <UserLoginPage />
        <Footer />
      </div>
    );
  };
  
  export default UserLogin;