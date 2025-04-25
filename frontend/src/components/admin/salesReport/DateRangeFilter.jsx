"use client"

import { useState, useRef, useEffect } from "react"

const DateRangeFilter = ({ startDate, endDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle date selection
  const handleDateChange = (type, e) => {
    const date = new Date(e.target.value)
    if (type === "start") {
      onDateChange({
        startDate: date,
        endDate: endDate < date ? date : endDate,
      })
    } else {
      onDateChange({
        startDate: startDate > date ? date : startDate,
        endDate: date,
      })
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] text-left"
      >
        <span>
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-72">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => handleDateChange("start", e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => handleDateChange("end", e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                min={startDate.toISOString().split("T")[0]}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
