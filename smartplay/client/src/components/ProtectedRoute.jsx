import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Show a loading spinner or skeleton screen while checking auth
    return <div className='flex justify-center items-center h-screen'><p>Loading...</p></div>; 
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" replace />; // Use replace to avoid back button loop
  }

  // If authenticated, render the child components (or Outlet for nested routes)
  return children ? children : <Outlet />; 
};

export default ProtectedRoute;
