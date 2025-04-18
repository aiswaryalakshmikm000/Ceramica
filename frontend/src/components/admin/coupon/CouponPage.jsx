// AdminLayout.js
import React from 'react';
import SideBar from '../../admin/SideBar'; 
import Coupons from "./Coupons"

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <Coupons />
      </main>
    </div>
  );
};

export default AdminLayout;