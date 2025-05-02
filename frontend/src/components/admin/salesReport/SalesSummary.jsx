
import { TrendingUp, ShoppingBag, CreditCard, Percent, Tag } from "lucide-react";

const SalesSummary = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sales</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.totalSales)}</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-[#3c73a8]" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Sales</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.netSales)}</h3>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <h3 className="text-2xl font-bold">{data.totalOrders}</h3>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.averageOrderValue)}</h3>
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Products Discounts</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.totalProductsDiscount)}</h3>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <Percent className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Offer Discounts</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.totalOfferDiscount)}</h3>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Percent className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Coupon Discounts</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.totalCouponDiscount)}</h3>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <Tag className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Discounts</p>
            <h3 className="text-2xl font-bold">{formatCurrency(data.totalDiscount)}</h3>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <Percent className="h-6 w-6 text-pink-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;