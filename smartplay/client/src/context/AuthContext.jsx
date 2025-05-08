import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Import the configured Axios instance
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info (id, email)
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Get token from storage initially
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial check
  const navigate = useNavigate();

  useEffect(() => {
    // Function to verify token and fetch user data on initial load or token change
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        // Add token to Axios default headers for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Optional: Fetch user profile to verify token is still valid
          // const response = await api.get('/auth/profile'); // Example endpoint
          // setUser(response.data.user); 
          
          // Simplified: Assume token is valid if it exists. Decode it for user info (less secure)
          // Or just set a generic logged-in state without user details initially
           setUser({ isAuthenticated: true }); // Simple flag, replace if fetching profile
           console.log("User authenticated from stored token.");

        } catch (error) {
          console.error("Token verification failed:", error);
          // Clear invalid token and user data
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
          // Ensure headers are clear if no token
          delete api.defaults.headers.common['Authorization'];
      }
      setIsLoading(false); // Finished loading/checking
    };

    verifyUser();
  }, []); // Run only once on component mount

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: loggedInUser } = response.data;

      // Store token and user data
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(loggedInUser); // Store user info received from backend

      // Set Axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log("Login successful, user set:", loggedInUser);
      navigate('/dashboard'); // Navigate after successful login

    } catch (error) {
      console.error("Login failed in context:", error);
       // Clear any potential stale data on failure
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      throw error; // Re-throw error so the component can catch it (e.g., for toast)
    } finally {
      setIsLoading(false);
    }
  };

  // Register function (Example: just calls API, doesn't auto-login)
  const register = async (email, password) => {
     try {
      setIsLoading(true);
      await api.post('/auth/register', { email, password });
      // Success handled in the component (e.g., show toast, redirect to login)
    } catch (error) {
      console.error("Registration failed in context:", error);
      throw error; // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  }

  // Logout function
  const logout = () => {
    // Clear token, user data, local storage, and Axios header
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    console.log("User logged out.");
    navigate('/login'); // Redirect to login page
  };

  // Value provided by the context
  const value = {
    user,
    token,
    isAuthenticated: !!token, // Simple check if token exists
    isLoading,
    login,
    register, // Provide register function if needed in components
    logout,
  };

  // Render children only after initial loading check is complete
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
