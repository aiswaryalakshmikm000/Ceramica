// AdminLayout.js
import React from 'react';
import SideBar from '../../admin/SideBar'; 
import OrderManagement from './OrderManagement'; 

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <OrderManagement />
      </main>
    </div>
  );
};

export default AdminLayout;