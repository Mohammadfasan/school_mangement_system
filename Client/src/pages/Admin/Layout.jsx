// pages/Admin/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/Admin_page/Sidebar.jsx'; 
import AdminNavbar from '../../components/Admin_page/navbar_adi.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      
      <div className="flex flex-col flex-1 w-full overflow-hidden md:ml-72">
        
        <header className="h-16 bg-white shadow-md z-10">
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet /> 
        </main>
      </div>

    </div>
  );
};

export default Layout;