import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api'; // Import the Axios instance
import TextInput from '../components/TextInput'; // Reusable input component
import Button from '../components/Button'; // Reusable button component
import { FaUserPlus } from 'react-icons/fa'; // Example icon

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // --- Basic Client-Side Validation ---
    if (!email || !password || !confirmPassword) {
      toast.warn("Please fill in all fields.");
      return;
    }
    if (password.length < 6) { // Example: Enforce minimum password length
        toast.warn("Password must be at least 6 characters long.");
        return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // --- End Validation ---

    setIsLoading(true); // Start loading state

    try {
      // Call the backend registration endpoint directly using the api instance
      const response = await api.post('/auth/register', { email, password });

      // Handle successful registration
      toast.success(response.data.message || "Registration successful! Please login.");
      
      // Redirect the user to the login page after successful registration
      navigate('/login'); 

    } catch (error) {
      // Handle errors from the backend API call
      console.error("Registration error:", error);
      // Extract error message from backend response if available
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message); // Display error to the user
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
            <FaUserPlus className="text-3xl text-indigo-600 dark:text-indigo-400 mb-2" />
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Create your SmartPlay Account
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
            autoComplete="new-password" // Indicate new password for browser assistance
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••• (min. 6 characters)"
            disabled={isLoading}
          />
          <TextInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
          
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full" // Make button full width
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link 
            to="/login" // Link to the login page
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
