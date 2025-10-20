// components/Admin_page/Sidebar.jsx

import React from 'react';
import { FiGrid, FiCalendar, FiBell, FiClock, FiUsers, FiAward, FiX } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom'; 
import Logo from '../../assets/images/logo.png'; 
import {image} from "../../assets/images/asserts2.js"

const navItems = [
  { name: 'Dashboard', icon: FiGrid, path: '/dashboard' }, 
  { name: 'Event', icon: FiCalendar, path: '/dashboard/event_manage' },
  { name: 'Announcement', icon: FiBell, path: '/dashboard/announcement_manage' },
  { name: 'Timetable', icon: FiClock, path: '/dashboard/timetable_manage' },
  { name: 'Sport', icon: FiAward, path: '/dashboard/sport_manage' },
  { name: 'Achievement', icon: FiAward, path: '/dashboard/achievement_manage' },
  { name: 'Student', icon: FiUsers, path: '/dashboard/student_manage' },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  
  const darkGreen = '#059669';   
  const activeGreen = '#5dc252'; 
  const sidebarWidth = '280px';
  const location = useLocation();

  return (
    <>
      <aside 
        style={{ backgroundColor: darkGreen, width: sidebarWidth }} 
        className={`
          h-screen fixed top-0 left-0 text-white shadow-xl flex flex-col pt-4 overflow-y-auto z-50
          transform -translate-x-full md:translate-x-0 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        
        <div className="flex items-center justify-between px-6 pb-6">
           <div className="flex items-center space-x-2">
             <div className='flex items-center'>
                <img 
                  src={Logo} 
                  alt="Sport Logo" 
                  className='h-12 w-12 rounded-full border-2 border-white object-cover mr-2 bg-white cursor-pointer'
                   onClick={() => window.location.href = '/'}
                />
              </div>
              <span className="text-white text-xl font-bold tracking-wider">EDU SYNC</span>
           </div>
           
           <button 
             onClick={toggleSidebar} 
             className="md:hidden p-1 rounded-full text-white/80 hover:bg-white/20"
             aria-label="Close sidebar"
           >
             <FiX className="text-2xl" />
           </button>
        </div>
        
        <div>
          <p className='pt-1 bg-white/10'></p>
        </div>
       
        <div className="flex justify-center p-6 pb-8">
          <div className="relative">
            <img
              src={image[0].src}
              alt="Student Profile"
              className="w-30 h-30 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
        
        <nav className="flex-grow space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path) && (item.path !== '/dashboard' || location.pathname === '/dashboard');
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => { if (isSidebarOpen) toggleSidebar(); }}
                className={`
                  flex items-center px-6 py-3 space-x-4 text-base font-medium
                  transition duration-150 ease-in-out
                  ${isActive
                    ? 'text-white rounded-r-[50px] shadow-lg'
                    : 'text-white/80 hover:bg-black/10'
                  }
                `}
                style={isActive ? { backgroundColor: activeGreen } : {}}
              >
                <Icon className="text-xl" /> 
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;