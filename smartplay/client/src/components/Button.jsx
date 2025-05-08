import React from 'react';

const Button = ({ children, type = "button", onClick, disabled = false, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = '';
  switch (variant) {
    case 'secondary':
      variantStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'primary':
    default:
      variantStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`} // Combine base, variant, and custom classes
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
