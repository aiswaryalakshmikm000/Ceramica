
"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar } from "lucide-react"
import { format, isValid } from "date-fns"

const DateRangeFilter = ({ startDate, endDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Format date for display
  const formatDate = (date) => {
    if (!isValid(date)) return "Invalid date"
    return format(date, "MMM d, yyyy")
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
    if (!isValid(date)) return

    if (type === "start") {
      const newEndDate = date > endDate ? date : endDate
      onDateChange({
        startDate: date,
        endDate: newEndDate,
      })
    } else {
      const newStartDate = date < startDate ? date : startDate
      onDateChange({
        startDate: newStartDate,
        endDate: date,
      })
    }
  }

  // Format date for input value
  const formatDateForInput = (date) => {
    if (!isValid(date)) return ""
    return format(date, "yyyy-MM-dd")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">
        <Calendar size={16} />
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] text-left"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-72">
          <div className="grid gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={formatDateForInput(startDate)}
                onChange={(e) => handleDateChange("start", e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                max={formatDateForInput(endDate)}
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={formatDateForInput(endDate)}
                onChange={(e) => handleDateChange("end", e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c73a8]"
                min={formatDateForInput(startDate)}
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
