import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for potential redirects

// --- Page Imports ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VideoQnAPage from './pages/VideoQnAPage';

// --- Component Imports ---
import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  // You can adjust the padding-top value based on the final height of your Navbar.
  // Common Tailwind heights: h-16 -> pt-16, h-20 -> pt-20
  const navbarHeightPadding = "pt-16 md:pt-20"; // Example: 4rem on small screens, 5rem on medium+

  return (
    // Use flex flex-col min-h-screen to ensure footer (if added) stays at bottom
    <div className="flex flex-col min-h-screen"> 
      <Navbar /> 
      
      {/* Main content area */}
      {/* Apply top padding to prevent content from hiding under the fixed Navbar */}
      {/* Apply horizontal padding for consistent spacing */}
      <main className={`flex-grow ${navbarHeightPadding} px-4 sm:px-6 lg:px-8`}> 
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Protected Routes --- */}
            {/* Wrap protected pages with the ProtectedRoute component */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/video/:videoId" // Dynamic route for specific video Q&A
              element={
                <ProtectedRoute>
                  <VideoQnAPage />
                </ProtectedRoute>
              } 
            />

            {/* --- Catch-all / 404 Route --- */}
            {/* Renders when no other route matches */}
            <Route path="*" element={
                <div className='py-10 text-center'>
                    <h1 className='text-2xl font-bold text-gray-700 dark:text-gray-300'>404 - Page Not Found</h1>
                    <p className='mt-2 text-gray-500 dark:text-gray-400'>Sorry, the page you are looking for does not exist.</p>
                    {/* Optional: Link back home */}
                    {/* <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">Go back home</Link> */}
                </div>
            } />
          </Routes>
       </main>
       
       {/* Optional: You can add a Footer component here */}
       {/* <Footer /> */}
    </div>
  );
}

export default App;
