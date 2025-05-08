import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors (optional)
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (e.g., to handle 401 errors globally)
/*
api.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.warn("Unauthorized request (401). Logging out.");
      localStorage.removeItem('authToken');
      // Optionally trigger a logout action from context or redirect
      // Be careful with state updates within interceptors
      window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error); // Reject the promise for other errors
  }
);
*/

export default api;

