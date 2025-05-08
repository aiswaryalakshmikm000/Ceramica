import React from 'react';
import SideBar from '../../admin/SideBar'; 
import AdminOffersPage from './AdminOfferPage';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <AdminOffersPage />
      </main>
    </div>
  );
};

export default AdminLayout;