// import { useState } from "react"
// import { AlignLeft } from "lucide-react"
// import Sidebar from "./Sidebar"

// const SidebarToggle = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }

//   return (
//     <>
//       <button
//         onClick={toggleSidebar}
//         className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
//         aria-label="Open sidebar menu"
//       >
//         <AlignLeft size={22} />
//       </button>

//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//     </>
//   )
// }

// export default SidebarToggle

import { useState } from "react";
import { AlignLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-orange-100 text-orange-800 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlignLeft size={24} />
      </motion.button>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default SidebarToggle;