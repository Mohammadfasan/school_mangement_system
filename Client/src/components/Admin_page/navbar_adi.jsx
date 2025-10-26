// src/components/Admin_page/navbar_adi.jsx
import React from 'react';
import { FiBell, FiMenu } from 'react-icons/fi'; 
import { BiSolidCircle } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Navbar_adi = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      '/dashboard': 'Dashboard',
      '/dashboard/event_manage': 'Event Management',
      '/dashboard/announcement_manage': 'Announcement Management',
      '/dashboard/timetable_manage': 'Timetable Management',
      '/dashboard/sport_manage': 'Sport Management',
      '/dashboard/achievement_manage': 'Achievement Management',
      '/dashboard/student_manage': 'Student Management',
    };
    
    // Find the best matching route
    const matchingKey = Object.keys(titleMap)
      .sort((a, b) => b.length - a.length)
      .find(key => path.startsWith(key));
    
    return titleMap[matchingKey] || 'Dashboard';
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-600 hover:text-green-600"
            aria-label="Open sidebar"
          >
            <FiMenu className="text-2xl" />
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative">
            <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-green-600 transition-colors" />
            <BiSolidCircle className="absolute -top-1 -right-1 text-red-500 text-xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</span>
            <span className="text-xs text-gray-500 hidden sm:block">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar_adi;