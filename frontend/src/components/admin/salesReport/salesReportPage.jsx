// AdminLayout.js
import React from 'react';
import SideBar from '../../admin/SideBar'; 
import SalesReport from './salesReport';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <SalesReport />
      </main>
    </div>
  );
};

export default AdminLayout;