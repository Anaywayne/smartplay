/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Include all relevant file types in src
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    // Optional: Add dark mode support (class strategy recommended)
    darkMode: 'class',
  }