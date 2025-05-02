// AdminLayout.js
import React from 'react';
import SideBar from '../../admin/SideBar'; 
import AdminDashboard from './AdminDashboard';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminLayout;