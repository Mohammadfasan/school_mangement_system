import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/images/logo.png';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import Notification from '../assets/images/notification.png';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationPopup from '../pages/NotificationPopup';
import { useAuth } from '../Context/AuthContext';

const Navbar = ({ onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
  const [activePage, setActivePage] = useState('Home');
  
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Debug user data - ENHANCED LOGS
  useEffect(() => {
    
  }, [user, isAuthenticated]);

  useEffect(() => {
    const pathToPage = {
      '/': 'Home',
      '/achievement': 'Achievement',
      '/event': 'Event',
      '/dashboard': 'Dashboard',
      '/signin': 'Sign In',
      '/signup': 'Sign Up',
      '/timetable': 'Timetable Management',
      '/student': 'Student Management',
      '/sport': 'Sport Management',
    };
    
    setActivePage(pathToPage[location.pathname] || 'Home');
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPagesOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation function
  const handleNavigation = (pageName, route = '') => {
    setActivePage(pageName);
    setIsMenuOpen(false);
    setIsPagesOpen(false);
    setIsNotificationOpen(false);

    if (route) {
      navigate(route);
    } else {
      switch(pageName) {
        case 'Home': navigate('/'); break;
        case 'Achievement': navigate('/achievement'); break;
        case 'Event': navigate('/event'); break;
        case 'Dashboard': 
         
          
          // Check role field for admin
          if (isAuthenticated && user?.role === 'admin') {
            navigate('/dashboard');
          } else {
            onLoginClick();
          }
          break;
        case 'Sign In': 
          onLoginClick();
          break;
        case 'Sign Up': 
          onSignupClick();
          break;
        case 'Timetable Management': navigate('/timetable'); break;
        case 'Student Management': navigate('/student'); break;
        case 'Sport Management': navigate('/sport'); break;
        default: navigate('/');
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Toggle function for notification popup
  const toggleNotifications = () => {
    setIsNotificationOpen(prevState => !prevState);
  };

  // Define nav items - Show Dashboard only for admin users
  const getNavItems = () => {
    const baseItems = [
      { label: 'Home', href: '#', route: '/' },
      { 
        label: 'Pages', 
        href: '#', 
        dropdown: [
          { label: 'Timetable Management', route: '/timetable' },
          { label: 'Student Management', route: '/student' },
          { label: 'Sport Management', route: '/sport' }
        ]
      },
      { label: 'Achievement', href: '#', route: '/achievement' },
      { label: 'Event', href: '#', route: '/event' },
    ];

    const shouldShowDashboard = isAuthenticated && user?.role === 'admin';
   
    
    if (shouldShowDashboard) {
      baseItems.push({ label: 'Dashboard', href: '#', route: '/dashboard' });
    } else {
      console.log('❌ NOT adding Dashboard to navbar');
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const isItemActive = (item) => {
    if (item.dropdown) {
      return item.dropdown.some(dropdownItem => dropdownItem.label === activePage);
    }
    return item.label === activePage;
  };

  // Check if user is admin
  const isAdminUser = user?.role === 'admin';

  return (
    <>
     

      <div 
        className='bg-white border-2 border-[#059669] lg:px-4 lg:py-4 rounded-3xl lg:mt-10 lg:max-w-7xl mx-auto mt-5 px-3 py-2 max-w-[350px]'
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsPagesOpen(false);
            setIsMenuOpen(false);
            setIsNotificationOpen(false); 
          }
        }}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <img src={Logo} alt="Sport Logo" className='h-8 w-8 mr-3 cursor-pointer' onClick={() => handleNavigation('Home')} />
          </div>

          <nav className='hidden md:flex space-x-7'>
            {navItems.map((item) => (
              <div key={item.label} className='relative'>
                {item.dropdown ? (
                  <div className='relative' ref={dropdownRef}>
                    <button
                      onClick={() => setIsPagesOpen(!isPagesOpen)}
                      className={`flex items-center gap-1 font-medium transition duration-200 relative pb-2 ${
                        isItemActive(item) ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                      }`}
                      aria-expanded={isPagesOpen}
                      aria-haspopup="true"
                    >
                      {item.label} <ChevronDown size={16} />
                      
                      {isItemActive(item) && (
                        <div className='absolute bottom-0 left-0 w-full h-[3px] bg-[#A7F8A4] rounded-full'></div>
                      )}
                    </button>

                    {isPagesOpen && (
                      <ul 
                        role="menu" 
                        aria-label="Pages submenu"
                        className='absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2'
                      >
                        {item.dropdown.map((dropdownItem) => (
                          <li key={dropdownItem.label}>
                            <button
                              onClick={() => handleNavigation(dropdownItem.label, dropdownItem.route)}
                              className={`block w-full text-left px-4 py-2 transition-colors duration-200 relative ${
                                activePage === dropdownItem.label 
                                  ? 'text-[#059669] bg-green-50' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#059669]'
                              }`}
                            >
                              {dropdownItem.label}
                              {activePage === dropdownItem.label && (
                                <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#059669] rounded-full'></div>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.label, item.route)}
                    className={`font-medium transition duration-200 relative pb-2 ${
                      activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                  >
                    {item.label}
                    
                    {activePage === item.label && (
                      <div className='absolute bottom-0 left-0 w-full h-[3px] bg-[#A7F8A4] rounded-full'></div>
                    )}
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className='hidden md:flex items-center space-x-6'>
            <div className='flex items-center space-x-4'>
              {!isAuthenticated ? (
                <>
                  <button 
                    className={`font-medium px-4 py-2 transition duration-200 relative pb-2 ${
                      activePage === 'Sign In' ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                    onClick={onLoginClick}
                  >
                    Sign In
                    {activePage === 'Sign In' && (
                      <div className='absolute bottom-0 left-0 w-full h-[3px] bg-[#A7F8A4] rounded-full'></div>
                    )}
                  </button>
                  <button 
                    className='bg-[#059669] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#047857] transition duration-200'
                    onClick={onSignupClick}
                  >
                    SIGN UP
                  </button>
                </>
              ) : (
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-gray-700 font-medium'>Welcome, {user?.firstName || user?.name || 'User'}</span>
                    {isAdminUser && (
                      <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                        Admin
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className='flex items-center space-x-2 bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200'
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            <div className='relative' ref={notificationRef}>
              <button onClick={toggleNotifications} className="relative">
                <img 
                  src={Notification} 
                  alt="Notifications" 
                  className='h-6 w-6 rounded cursor-pointer hover:opacity-80 transition duration-200'
                />
                <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white'></span>
              </button>
              <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
            </div>
          </div>

          <div className='relative md:hidden flex items-center' ref={notificationRef}>
            <button onClick={toggleNotifications} className="relative mr-2">
              <img 
                src={Notification} 
                alt="Notifications" 
                className='h-5 w-5 rounded cursor-pointer hover:opacity-80 transition duration-200 ml-55'
              />
              <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white'></span>
            </button>
            <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
          </div>

          <button 
            className='md:hidden p-2 text-gray-700 hover:text-[#059669] transition duration-200 rounded-lg hover:bg-gray-50'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-100 opacity-100 mt-4 pb-2 border-t border-gray-200 pt-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className='flex flex-col space-y-3'>
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => setIsPagesOpen(!isPagesOpen)}
                      className={`flex items-center justify-between w-full font-medium py-2 transition duration-200 relative ${
                        isItemActive(item) ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                      }`}
                    >
                      <span className='flex items-center'>
                        {item.label}
                        {isItemActive(item) && (
                          <div className='ml-2 w-1 h-4 bg-[#059669] rounded-full'></div>
                        )}
                      </span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isPagesOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <ul className='flex flex-col pl-4 mt-1 space-y-2'>
                        {item.dropdown.map((dropdownItem) => (
                          <li key={dropdownItem.label}>
                            <button
                              onClick={() => handleNavigation(dropdownItem.label, dropdownItem.route)}
                              className={`flex items-center w-full text-left py-1 transition duration-200 relative ${
                                activePage === dropdownItem.label ? 'text-[#059669]' : 'text-gray-600 hover:text-[#059669]'
                              }`}
                            >
                              {dropdownItem.label}
                              {activePage === dropdownItem.label && (
                                <div className='ml-2 w-1 h-4 bg-[#059669] rounded-full'></div>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.label, item.route)}
                    className={`flex items-center w-full text-left font-medium py-2 transition duration-200 ${
                      activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                  >
                    {item.label}
                    {activePage === item.label && (
                      <div className='ml-2 w-1 h-4 bg-[#059669] rounded-full'></div>
                    )}
                  </button>
                )}
              </div>
            ))}
            
            <div className='flex flex-col space-y-3 mt-2 pt-2 border-t border-gray-200'>
              {!isAuthenticated ? (
                <>
                  <button 
                    className={`flex items-center font-medium py-2 transition duration-200 ${
                      activePage === 'Sign In' ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                    onClick={onLoginClick}
                  >
                    Sign In
                    {activePage === 'Sign In' && (
                      <div className='ml-2 w-1 h-4 bg-[#059669] rounded-full'></div>
                    )}
                  </button>
                  <button 
                    className='bg-[#059669] text-white font-medium py-2 rounded-lg hover:bg-[#047857] transition duration-200 text-center'
                    onClick={onSignupClick}
                  >
                    SIGN UP
                  </button>
                </>
              ) : (
                <div className='flex flex-col space-y-3'>
                  <div className='flex flex-col space-y-2 py-2'>
                    <span className='text-gray-700 font-medium'>Welcome, {user?.firstName || user?.name || 'User'}</span>
                    {isAdminUser && (
                      <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full text-center w-fit'>
                        Admin
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className='flex items-center justify-center space-x-2 bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition duration-200'
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;