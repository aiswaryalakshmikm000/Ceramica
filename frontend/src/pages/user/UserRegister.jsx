
import UserRegisterPage from "../../components/user/UserRegisterPage"
import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"


const UserRegister = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <UserRegisterPage />
        <Footer />
      </div>
    );
  };
  
  export default UserRegister;