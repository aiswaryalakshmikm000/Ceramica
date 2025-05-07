const StatsCard = ({ title, value, icon, change, changeText, changeIcon }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-full">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          {changeIcon}
          <span className={`text-xs font-medium ml-1 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {changeText}
          </span>
        </div>
      </div>
    )
  }
  
  export default StatsCard
  