import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/images/logo.png';
import { Menu, X, ChevronDown } from 'lucide-react';
import Notification from '../assets/images/notification.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPagesOpen(false);
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

    if (route) {
      navigate(route);
    } else {
      switch(pageName) {
        case 'Home':
          navigate('/');
          break;
        case 'Achievement':
          navigate('/achievement');
          break;
        case 'Event':
          navigate('/event');
          break;
        case 'Dashboard':
          navigate('/dashboard');
          break;
        case 'Sign In':
          navigate('/signin');
          break;
        case 'Sign Up':
          navigate('/signup');
          break;
        case 'Timetable Management':
          navigate('/timetable');
          break;
        case 'Student Management':
          navigate('/student');
          break;
        case 'Sport Management':
          navigate('/sport');
          break;
        case 'Notification':
          navigate('/notification');
          break;
        default:
          navigate('/');
      }
    }
  };

  // Navigation items configuration
  const navItems = [
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
    { label: 'Dashboard', href: '#', route: '/dashboard' },
  ];

  return (
    <div 
      className='bg-white border-2 border-[#059669] lg:px-4 lg:py-4 rounded-3xl lg:mt-10 lg:max-w-7xl mx-auto mt-5 px-3 py-2 max-w-[350px]'
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsPagesOpen(false);
          setIsMenuOpen(false);
        }
      }}
    >
      {/* Main Navbar */}
      <div className='flex items-center justify-between'>
        {/* Logo Section */}
        <div className='flex items-center'>
          <img 
            src={Logo} 
            alt="Sport Logo" 
            className='h-8 w-8 mr-3 cursor-pointer'
            onClick={() => handleNavigation('Home')} 
          />
          
        </div>

        {/* Desktop Navigation Links */}
        <nav className='hidden md:flex space-x-7'>
          {navItems.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setIsPagesOpen(!isPagesOpen)}
                    className={`flex items-center gap-1 font-medium transition duration-200 ${
                      activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                    aria-expanded={isPagesOpen}
                    aria-haspopup="true"
                  >
                    {item.label} <ChevronDown size={16} />
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
                            className='block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#059669] transition-colors duration-200'
                          >
                            {dropdownItem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation(item.label, item.route)}
                  className={`font-medium transition duration-200 ${
                    activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Auth Buttons & Notification */}
        <div className='hidden md:flex items-center space-x-6'>
          <div className='flex items-center space-x-4'>
            <button 
              className='text-gray-700 hover:text-[#059669] font-medium px-4 py-2 transition duration-200'
              onClick={() => handleNavigation('Sign In')}
            >
              Sign In
            </button>
            <button 
              className='bg-[#059669] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#047857] transition duration-200'
              onClick={() => handleNavigation('Sign Up')}
            >
              SIGN UP
            </button>
          </div>
          <div className='relative'>
            <img 
              src={Notification} 
              alt="Notifications" 
              className='h-6 w-6 mr-2 rounded cursor-pointer hover:opacity-80 transition duration-200'
              onClick={() => handleNavigation('Notification')}
            />
            <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white'></span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className='relative md:hidden flex ml-50'>
          <img 
            src={Notification} 
            alt="Notifications" 
            className='h-5 w-5 mr-2 rounded cursor-pointer hover:opacity-80 transition duration-200'
            onClick={() => handleNavigation('Notification')}
          />
          <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white'></span>
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

      {/* Mobile Menu */}
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
                    className={`flex items-center justify-between w-full font-medium py-2 transition duration-200 ${
                      activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                    }`}
                  >
                    {item.label} <ChevronDown size={16} className={`transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isPagesOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className='flex flex-col pl-4 mt-1 space-y-2'>
                      {item.dropdown.map((dropdownItem) => (
                        <li key={dropdownItem.label}>
                          <button
                            onClick={() => handleNavigation(dropdownItem.label, dropdownItem.route)}
                            className='block w-full text-left py-1 text-gray-600 hover:text-[#059669] transition duration-200'
                          >
                            {dropdownItem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation(item.label, item.route)}
                  className={`block w-full text-left font-medium py-2 transition duration-200 ${
                    activePage === item.label ? 'text-[#059669]' : 'text-gray-700 hover:text-[#059669]'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div className='flex flex-col space-y-3 mt-2 pt-2 border-t border-gray-200'>
            <button 
              className='text-gray-700 hover:text-[#059669] font-medium py-2 transition duration-200 text-left'
              onClick={() => handleNavigation('Sign In')}
            >
              Sign In
            </button>
            <button 
              className='bg-[#059669] text-white font-medium py-2 rounded-lg hover:bg-[#047857] transition duration-200 text-center'
              onClick={() => handleNavigation('Sign Up')}
            >
              SIGN UP
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;