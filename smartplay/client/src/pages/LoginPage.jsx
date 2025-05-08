import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import TextInput from '../components/TextInput'; // Reusable input component
import Button from '../components/Button'; // Reusable button component
import { FaSignInAlt } from 'react-icons/fa'; // Example icon

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the form/button
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!email || !password) {
        toast.warn("Please enter both email and password.");
        return;
    }

    setIsLoading(true); // Indicate loading state

    try {
      // Call the login function provided by AuthContext
      // This function handles the API call, state update, local storage, and navigation on success
      await login(email, password); 
      
      // If login is successful, the AuthContext's login function should handle navigation
      // toast.success("Login successful!"); // Optionally show success toast here or let context handle it

    } catch (error) {
      // The login function in AuthContext should re-throw the error on failure
      console.error("Login page error:", error);
      // Extract error message from backend response if available, otherwise show generic message
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message); // Display error to the user
    } finally {
      setIsLoading(false); // Stop loading state regardless of success or failure
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
            <FaSignInAlt className="text-3xl text-indigo-600 dark:text-indigo-400 mb-2" />
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Login to SmartPlay
            </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
          <TextInput
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
          
          {/* Optional: Add 'Forgot Password?' link here */}
          {/* <div className="text-sm text-right">
             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
               Forgot password?
             </a>
          </div> */}
           
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full" // Make button full width
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/register" // Link to the registration page
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
