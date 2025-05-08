// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for active state
import { useAuth } from '../context/AuthContext';
import { FaPlayCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'; 

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Navigation is handled by the logout function in context
  };

  // Helper for NavLink active state styling
  const navLinkClass = ({ isActive }) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;

  return (
    // Make Navbar fixed, add background, shadow, padding, and z-index
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-700 h-16 md:h-20"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        {/* Logo/Brand */}
        <Link 
            to={isAuthenticated ? "/dashboard" : "/"} // Go to dashboard if logged in, else landing
            className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
           <FaPlayCircle />
           <span>SmartPlay</span>
        </Link>

        {/* Nav Links & Actions */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {isAuthenticated ? (
            <>
               {/* Dashboard Link */}
               <NavLink to="/dashboard" className={navLinkClass}>
                 <FaTachometerAlt className="mr-1.5 h-4 w-4" /> 
                 <span className='hidden sm:inline'>Dashboard</span>
               </NavLink>
               
               {/* Logout Button */}
               <button
                 onClick={handleLogout}
                 className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
               >
                 <FaSignOutAlt className="mr-1.5 h-4 w-4" /> 
                 <span className='hidden sm:inline'>Logout</span>
                 <span className='sm:hidden'>Out</span> {/* Shorter text for mobile */}
               </button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <NavLink to="/login" className={navLinkClass}>
                 <FaSignInAlt className="mr-1.5 h-4 w-4" /> 
                 Login
               </NavLink>
               
               {/* Register Button */}
               <NavLink 
                 to="/register" 
                 className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
               >
                 <FaUserPlus className="mr-1.5 h-4 w-4" /> 
                 Register
               </NavLink>
            </>
          )}
           {/* Optional: Add Dark mode toggle button here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
