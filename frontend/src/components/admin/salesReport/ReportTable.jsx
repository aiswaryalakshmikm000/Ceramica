


import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ReportTable = ({ data }) => {
  const [sortField, setSortField] = useState("period");
  const [sortDirection, setSortDirection] = useState("asc");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField]  < b[sortField] ? 1 : -1;
    }
  });

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 inline-block ml-1" /> : <ChevronDown className="h-4 w-4 inline-block ml-1" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Detailed Report</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 text-sm">
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("period")}>
                Period {renderSortIcon("period")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("sales")}>
                Sales {renderSortIcon("sales")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("productsDiscount")}>
                Products Discounts {renderSortIcon("productsDiscount")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("offerDiscount")}>
                Offer Discounts {renderSortIcon("offerDiscount")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("couponDiscount")}>
                Coupon Discounts {renderSortIcon("couponDiscount")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("netSales")}>
                Net Sales {renderSortIcon("netSales")}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("orders")}>
                Orders {renderSortIcon("orders")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 border-t">{row.period}</td>
                <td className="px-4 py-3 border-t">{formatCurrency(row.sales)}</td>
                <td className="px-4 py-3 border-t">{formatCurrency(row.productsDiscount)}</td>
                <td className="px-4 py-3 border-t">{formatCurrency(row.offerDiscount)}</td>
                <td className="px-4 py-3 border-t">{formatCurrency(row.couponDiscount)}</td>
                <td className="px-4 py-3 border-t">{formatCurrency(row.netSales)}</td>
                <td className="px-4 py-3 border-t">{row.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;