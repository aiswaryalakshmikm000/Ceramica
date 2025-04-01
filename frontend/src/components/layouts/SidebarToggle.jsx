"use client"

import { useState } from "react"
import { AlignLeft } from "lucide-react"
import Sidebar from "./Sidebar"

const SidebarToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2 text-ceramic-charcoal hover:text-ceramic-earth transition-colors"
        aria-label="Open sidebar menu"
      >
        <AlignLeft size={22} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

export default SidebarToggle

