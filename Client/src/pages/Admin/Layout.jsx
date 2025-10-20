// src/pages/Admin/Layout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Admin_page/Sidebar.jsx'; 
import Navbar_adi from '../../components/Admin_page/navbar_adi.jsx';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarWidth = '280px'; 
  const navbarHeight = '80px'; 

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div 
        className="flex-grow flex flex-col md:ml-[280px] transition-all duration-300 ease-in-out"
      >
        <header 
          style={{ height: navbarHeight }} 
          className="fixed top-0 z-30 bg-white shadow-md border-b border-gray-200
                     w-full md:w-[calc(100%-280px)] transition-all duration-300 ease-in-out"
        >
          <Navbar_adi toggleSidebar={toggleSidebar} />
        </header>

        <main 
          style={{ paddingTop: navbarHeight }}
          className="flex-grow"
        >
          <div className="p-6 md:p-8"> 
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;