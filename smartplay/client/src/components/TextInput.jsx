import React from 'react';

const TextInput = ({ label, id, name, type = "text", value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        {...props} // Pass down other props like autoComplete, etc.
      />
    </div>
  );
};

export default TextInput;
