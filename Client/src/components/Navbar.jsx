// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/images/logo.png';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import Notification from '../assets/images/notification.png';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationPopup from '../pages/NotificationPopup';
import { useAuth } from '../Context/AuthContext.jsx';

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

  useEffect(() => {
    const pathToPage = {
      '/': 'Home',
      '/achievement': 'Achievement',
      '/event': 'Event',
      '/timetable': 'Timetable Management',
      '/student': 'Student Management',
      '/sport': 'Sport Management',
      '/dashboard': 'Dashboard',
      '/signin': 'Sign In',
      '/signup': 'Sign Up',
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
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-7xl z-50 px-4">
        <div className='bg-white border-2 border-[#059669] lg:px-4 lg:py-4 rounded-3xl shadow-lg'>
          {/* Desktop View */}
          <div className='hidden md:flex items-center justify-between'>
            <div className='flex items-center'>
              {/* Round Logo */}
              <img 
                src={Logo} 
                alt="Sport Logo" 
                className='h-10 w-10 mr-3 cursor-pointer rounded-full border-2 border-[#059669] p-1' 
                onClick={() => handleNavigation('Home')} 
              />
            </div>

            {/* Larger Menu Items */}
            <nav className='flex space-x-8'>
              {navItems.map((item) => (
                <div key={item.label} className='relative'>
                  {item.dropdown ? (
                    <div className='relative' ref={dropdownRef}>
                      <button
                        onClick={() => setIsPagesOpen(!isPagesOpen)}
                        className={`flex items-center gap-1 font-semibold text-lg transition duration-200 relative pb-2 ${
                          isItemActive(item) ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                        }`}
                        aria-expanded={isPagesOpen}
                        aria-haspopup="true"
                      >
                        {item.label} <ChevronDown size={18} />
                        
                        {isItemActive(item) && (
                          <div className='absolute bottom-0 left-0 w-full h-[4px] bg-[#A7F8A4] rounded-full'></div>
                        )}
                      </button>

                      {isPagesOpen && (
                        <ul 
                          role="menu" 
                          aria-label="Pages submenu"
                          className='absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2'
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <li key={dropdownItem.label}>
                              <button
                                onClick={() => handleNavigation(dropdownItem.label, dropdownItem.route)}
                                className={`block w-full text-left px-4 py-3 transition-colors duration-200 relative text-base ${
                                  activePage === dropdownItem.label 
                                    ? 'text-[#059669] bg-green-50 font-semibold' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#059669]'
                                }`}
                              >
                                {dropdownItem.label}
                                {activePage === dropdownItem.label && (
                                  <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#059669] rounded-full'></div>
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
                      className={`font-semibold text-lg transition duration-200 relative pb-2 ${
                        activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                      }`}
                    >
                      {item.label}
                      
                      {activePage === item.label && (
                        <div className='absolute bottom-0 left-0 w-full h-[4px] bg-[#A7F8A4] rounded-full'></div>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-4'>
                {!isAuthenticated ? (
                  <>
                    <button 
                      className={`font-semibold text-lg px-5 py-2 transition duration-200 relative pb-2 ${
                        activePage === 'Sign In' ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                      }`}
                      onClick={onLoginClick}
                    >
                      Sign In
                      {activePage === 'Sign In' && (
                        <div className='absolute bottom-0 left-0 w-full h-[4px] bg-[#A7F8A4] rounded-full'></div>
                      )}
                    </button>
                    <button 
                      className='bg-[#059669] text-white font-semibold text-lg px-7 py-3 rounded-lg hover:bg-[#047857] transition duration-200'
                      onClick={onSignupClick}
                    >
                      SIGN UP
                    </button>
                  </>
                ) : (
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-3'>
                      <span className='text-gray-700 font-semibold text-lg'>Welcome, {user?.firstName || user?.name || 'User'}</span>
                      {isAdminUser && (
                        <span className='bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium'>
                          Admin
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className='flex items-center space-x-2 bg-red-500 text-white font-semibold px-5 py-3 rounded-lg hover:bg-red-600 transition duration-200 text-lg'
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Notification moved closer to menu */}
              <div className='relative' ref={notificationRef}>
                <button onClick={toggleNotifications} className="relative">
                  <img 
                    src={Notification} 
                    alt="Notifications" 
                    className='h-7 w-7 rounded cursor-pointer hover:opacity-80 transition duration-200'
                  />
                  <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white'></span>
                </button>
                <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className='md:hidden'>
            <div className='flex items-center justify-between'>
              {/* Round Logo - Left */}
              <div className='flex items-center flex-1'>
                <img 
                  src={Logo} 
                  alt="Sport Logo" 
                  className='h-10 w-10 cursor-pointer rounded-full border-2 border-[#059669] p-1' 
                  onClick={() => handleNavigation('Home')} 
                />
              </div>

              {/* Notification and Menu together - Right Side */}
              <div className='flex items-center space-x-4'>
                {/* Notification */}
                <div className='relative' ref={notificationRef}>
                  <button onClick={toggleNotifications} className="relative">
                    <img 
                      src={Notification} 
                      alt="Notifications" 
                      className='h-7 w-7 rounded cursor-pointer hover:opacity-80 transition duration-200'
                    />
                    <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white'></span>
                  </button>
                  <NotificationPopup isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                </div>

                {/* Menu Button */}
                <button 
                  className='p-2 text-gray-700 hover:text-[#059669] transition duration-200 rounded-lg hover:bg-gray-50'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu - Larger Text - FIXED: Now shows auth buttons properly */}
            <div className={`overflow-hidden transition-all duration-300 ${
              isMenuOpen ? 'max-h-screen opacity-100 mt-4 pb-2 border-t border-gray-200 pt-4' : 'max-h-0 opacity-0'
            }`}>
              <nav className='flex flex-col space-y-4'>
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => setIsPagesOpen(!isPagesOpen)}
                          className={`flex items-center justify-between w-full font-semibold text-lg py-3 transition duration-200 relative ${
                            isItemActive(item) ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                          }`}
                        >
                          <span className='flex items-center'>
                            {item.label}
                            {isItemActive(item) && (
                              <div className='ml-3 w-2 h-6 bg-[#059669] rounded-full'></div>
                            )}
                          </span>
                          <ChevronDown size={20} className={`transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${
                          isPagesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <ul className='flex flex-col pl-6 mt-2 space-y-3'>
                            {item.dropdown.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <button
                                  onClick={() => handleNavigation(dropdownItem.label, dropdownItem.route)}
                                  className={`flex items-center w-full text-left py-2 transition duration-200 text-base relative ${
                                    activePage === dropdownItem.label ? 'text-[#059669] font-semibold' : 'text-gray-600 hover:text-[#059669]'
                                  }`}
                                >
                                  {dropdownItem.label}
                                  {activePage === dropdownItem.label && (
                                    <div className='ml-3 w-2 h-5 bg-[#059669] rounded-full'></div>
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
                        className={`flex items-center w-full text-left font-semibold text-lg py-3 transition duration-200 ${
                          activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                        }`}
                      >
                        {item.label}
                        {activePage === item.label && (
                          <div className='ml-3 w-2 h-6 bg-[#059669] rounded-full'></div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
                
                {/* FIXED: Authentication section - Now properly shows Sign In/Logout */}
                <div className='flex flex-col space-y-4 mt-3 pt-3 border-t border-gray-200'>
                  {!isAuthenticated ? (
                    <>
                      {/* Sign In Button */}
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLoginClick();
                        }}
                        className={`flex items-center font-semibold text-lg py-3 transition duration-200 ${
                          activePage === 'Sign In' ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                        }`}
                      >
                        Sign In
                        {activePage === 'Sign In' && (
                          <div className='ml-3 w-2 h-6 bg-[#059669] rounded-full'></div>
                        )}
                      </button>
                      
                      {/* Sign Up Button */}
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSignupClick();
                        }}
                        className='bg-[#059669] text-white font-semibold text-lg py-3 rounded-lg hover:bg-[#047857] transition duration-200 text-center'
                      >
                        SIGN UP
                      </button>
                    </>
                  ) : (
                    <div className='flex flex-col space-y-4'>
                      {/* User Info */}
                      <div className='flex flex-col space-y-3 py-3'>
                        <span className='text-gray-700 font-semibold text-lg'>Welcome, {user?.firstName || user?.name || 'User'}</span>
                        {isAdminUser && (
                          <span className='bg-green-100 text-green-800 text-base px-3 py-2 rounded-full text-center w-fit font-medium'>
                            Admin
                          </span>
                        )}
                      </div>
                      
                      {/* Logout Button */}
                      <button 
                        onClick={handleLogout}
                        className='flex items-center justify-center space-x-3 bg-red-500 text-white font-semibold text-lg py-3 rounded-lg hover:bg-red-600 transition duration-200'
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;