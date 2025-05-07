import Navbar from "../../components/layouts/Navbar"
import Footer from "../../components/layouts/Footer"
import About from "../../components/user/about/about";

const UserAbout = () => {
  
    return (
      <div className="min-h-screen">
        <Navbar />
        <About />
        <Footer />
      </div>
    );
  };
  
  export default UserAbout;