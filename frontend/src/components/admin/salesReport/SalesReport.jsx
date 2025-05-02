
import { useState, useEffect, useRef } from "react";
import { Calendar, FileSpreadsheet, FileIcon as FilePdf, BarChart4, LineChart, PieChart, ChevronDown, Filter } from "lucide-react";
import SalesChart from "./SalesChart";
import SalesSummary from "./SalesSummary";
import DateRangeFilter from "./DateRangeFilter";
import ReportTable from "./ReportTable";
import { useGetSalesReportQuery, useDownloadExcelReportMutation, useDownloadPdfReportMutation } from "../../../features/adminAuth/adminSalesReportApiSlice";
import { toast } from "react-toastify";
import Breadcrumbs from "../../common/Breadcrumbs";

const SalesReport = () => {
  const [dateFilter, setDateFilter] = useState("week");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const dropdownRef = useRef(null);

  const queryArgs = {
    period: dateFilter,
    startDate: customDateRange.startDate instanceof Date ? customDateRange.startDate.toISOString() : new Date(customDateRange.startDate).toISOString(),
    endDate: customDateRange.endDate instanceof Date ? customDateRange.endDate.toISOString() : new Date(customDateRange.endDate).toISOString(),
  };

  const { data: reportData, isLoading } = useGetSalesReportQuery(queryArgs);
  const [downloadExcelReport, { isLoading: isExcelLoading }] = useDownloadExcelReportMutation();
  const [downloadPdfReport, { isLoading: isPdfLoading }] = useDownloadPdfReportMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    const today = new Date();
    if (filter === "day") {
      setCustomDateRange({ startDate: today, endDate: today });
    } else if (filter === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      setCustomDateRange({ startDate: startOfWeek, endDate: today });
    } else if (filter === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setCustomDateRange({ startDate: startOfMonth, endDate: today });
    } else if (filter === "year") {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      setCustomDateRange({ startDate: startOfYear, endDate: today });
    }
  };

  const handleCustomDateChange = (range) => {
    setCustomDateRange({
      startDate: range.startDate instanceof Date ? range.startDate : new Date(range.startDate),
      endDate: range.endDate instanceof Date ? range.endDate : new Date(range.endDate),
    });
    setDateFilter("custom");
  };

  const handleDownloadReport = async (format) => {
    try {
      const downloadMutation = format === "excel" ? downloadExcelReport : downloadPdfReport;
      const response = await downloadMutation(queryArgs).unwrap();
      const blob = response;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-report-${format}-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error(`Error downloading ${format} report:`, error);
      toast.error(`Failed to download ${format} report. Please try again.`);
    }
  };

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Sales Report", href: "/admin/sales-report" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2 mt-2">Sales Report</h1>
          <p className="text-gray-600">View and manage sales performance data</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <DateRangeFilter startDate={customDateRange.startDate} endDate={customDateRange.endDate} onDateChange={handleCustomDateChange} />
              </div>
              <div className="flex flex-row gap-4 sm:items-center">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] whitespace-nowrap"
                  >
                    <Filter size={18} className="absolute left-3 text-gray-400" />
                    {dateFilter === "day" ? "Daily" : dateFilter === "week" ? "Weekly" : dateFilter === "month" ? "Monthly" : dateFilter === "year" ? "Yearly" : "Custom"}
                    <ChevronDown size={18} className={`${isFilterOpen ? "rotate-180" : ""} transition-transform`} />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="py-2">
                        <button onClick={() => handleDateFilterChange("day")} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${dateFilter === "day" ? "font-semibold text-[#3c73a8]" : "text-gray-700"}`}>
                          Daily
                        </button>
                        <button onClick={() => handleDateFilterChange("week")} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${dateFilter === "week" ? "font-semibold text-[#3c73a8]" : "text-gray-700"}`}>
                          Weekly
                        </button>
                        <button onClick={() => handleDateFilterChange("month")} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${dateFilter === "month" ? "font-semibold text-[#3c73a8]" : "text-gray-700"}`}>
                          Monthly
                        </button>
                        <button onClick={() => handleDateFilterChange("year")} className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${dateFilter === "year" ? "font-semibold text-[#3c73a8]" : "text-gray-700"}`}>
                          Yearly
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button onClick={() => setChartType("bar")} className={`p-2 ${chartType === "bar" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`} title="Bar Chart">
                    <BarChart4 size={18} />
                  </button>
                  <button onClick={() => setChartType("line")} className={`p-2 ${chartType === "line" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`} title="Line Chart">
                    <LineChart size={18} />
                  </button>
                  <button onClick={() => setChartType("pie")} className={`p-2 ${chartType === "pie" ? "bg-[#3c73a8] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`} title="Pie Chart">
                    <PieChart size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <button
                onClick={() => handleDownloadReport("excel")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3c73a8] flex items-center gap-2 whitespace-nowrap"
                title="Download Excel"
                disabled={isExcelLoading}
              >
                <FileSpreadsheet size={18} />
                {isExcelLoading ? "Downloading..." : "Excel"}
              </button>
              <button
                onClick={() => handleDownloadReport("pdf")}
                className="px-4 py-2 bg-[#3c73a8] text-white rounded-md hover:bg-[#2c5580] focus:outline-none focus:ring-2 focus:ring-[#3c73a8] flex items-center gap-2 whitespace-nowrap"
                title="Download PDF"
                disabled={isPdfLoading}
              >
                <FilePdf size={18} />
                {isPdfLoading ? "Downloading..." : "PDF"}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3c73a8]"></div>
          </div>
        ) : reportData && reportData.summary.totalOrders === 0 ? (
          <div className="text-center text-gray-500">No data available for this period.</div>
        ) : (
          <>
            {reportData && <SalesSummary data={reportData.summary} />}
            {reportData && <SalesChart data={reportData.chartData} type={chartType} />}
            {reportData && <ReportTable data={reportData.tableData} />}
          </>
        )}
      </main>
    </div>
  );
};

export default SalesReport;