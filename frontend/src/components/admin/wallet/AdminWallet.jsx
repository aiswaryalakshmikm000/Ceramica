// AdminLayout.js
import React from 'react';
import SideBar from '../../admin/SideBar'; 
import WalletListing from './WalletListing'; 

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <WalletListing />
      </main>
    </div>
  );
};

export default AdminLayout;