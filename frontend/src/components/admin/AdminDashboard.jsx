import React from 'react';
import Breadcrumbs from '../common/BreadCrumbs'; 
import Sidebar from './SideBar'; 

const AdminDashboard = () => {
    
  const dashboardData = {
    totalSales: 12500, 
    totalCustomers: 320,
    totalOrders: 450,
    bestSellingProduct: { name: 'Ceramic Mug - Blue', sales: 120 },
    recentOrders: [
      { id: '#ORD123', customer: 'John Doe', total: 45.99, status: 'Shipped' },
      { id: '#ORD124', customer: 'Jane Smith', total: 29.50, status: 'Pending' },
    ],
    topCategories: [
      { name: 'Mugs', sales: 3000 },
      { name: 'Plates', sales: 2500 },
    ],
  };

  // Breadcrumbs logic based on current route
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Dashboard', href: '/admin/dashboard' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600">Total Sales</h3>
            <p className="text-2xl font-bold">₹{dashboardData.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600">Total Customers</h3>
            <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600">Best Selling Product</h3>
            <p className="text-lg font-medium">{dashboardData.bestSellingProduct.name}</p>
            <p className="text-sm text-gray-600">{dashboardData.bestSellingProduct.sales} sold</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.customer}</td>
                  <td className="py-2">₹{order.total.toFixed(2)}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories</h3>
          <ul>
            {dashboardData.topCategories.map((category) => (
              <li key={category.name} className="flex justify-between py-2 border-b">
                <span>{category.name}</span>
                <span>₹{category.sales.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
