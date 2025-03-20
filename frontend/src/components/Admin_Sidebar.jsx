import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Edit, Users, User, Menu, X ,LogOut} from 'lucide-react';
import { Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    navigate('/auth');
  };

  
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Create a Blog', icon: <Edit size={20} />, path: '/create-blog' },
    { name: 'Join Community', icon: <Users size={20} />, path: '/join-community' },
    { 
      name: 'Profile', 
      icon: <User size={20} />, 
      path: '/profile' 
    },
    { 
      name: 'Logout', 
      icon: <LogOut size={20} />, 
      onClick: handleLogout 
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.onClick) {
      return (
        <div
          key={index}
          onClick={item.onClick}
          className={`flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-100` }
        >
          {item.icon}
          {!isDesktopCollapsed && <span className="font-medium">{item.name}</span>}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 ${
            isActive || location.pathname === item.path
              ? 'linear-gradient(90deg, #e2e2e2, #c9d6ff) text-black shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
      >
        {item.icon}
        {!isDesktopCollapsed && <span className="font-medium">{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* Semi-transparent overlay when mobile menu is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Hamburger button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => {
            if (screenWidth >= 768) {
              setIsDesktopCollapsed(!isDesktopCollapsed);
            } else {
              setIsMobileOpen(!isMobileOpen);
            }
          }}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-colors"
          aria-label="Toggle menu"
        >
          {screenWidth >= 768
            ? (isDesktopCollapsed ? <Menu size={24} /> : <X size={24} />)
            : (isMobileOpen ? <X size={24} /> : <Menu size={24} />)
          }
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen ${
          isDesktopCollapsed ? 'w-20' : 'w-64'
        } bg-white shadow-lg flex-col justify-between p-4 transition-all duration-300 hidden md:flex`}
      >
        {/* Logo */}
        {!isDesktopCollapsed && (
          <div className="flex items-center mb-6">
            <Avatar alt="Logo" src="/logo.png" className="mr-2" />
            <h1 className="text-xl font-bold">MyApp</h1>
          </div>
        )}

        {/* Menu */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>

      </div>

      
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg flex flex-col justify-between p-4 z-40 md:hidden"
          >
            {/* Logo and Close */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Avatar alt="Logo" src="/logo.png" className="mr-2" />
                <h1 className="text-xl font-bold">MyApp</h1>
              </div>
              <button onClick={() => setIsMobileOpen(false)} className="p-1">
                <X size={24} />
              </button>
            </div>

            {/* Menu */}
            <nav className="space-y-2 flex-1">
              {menuItems.map((item, index) => (
                <div key={index} onClick={item.onClick}>
                  {renderMenuItem(item, index)}
                </div>
              ))}
            </nav>

           
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
