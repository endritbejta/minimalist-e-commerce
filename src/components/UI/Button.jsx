import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button component that handles both internal links and standard button actions.
 * @param {ReactNode} children - The button text or content.
 * @param {string} to - Optional internal link path.
 * @param {string} variant - Visual style: 'primary', 'secondary', or 'link'.
 * @param {string} className - Additional CSS classes.
 * @param {function} onClick - Optional click handler.
 */
const Button = ({ 
  children, 
  to, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-block font-bold transition-all duration-300 transform active:scale-95 text-center";
  
  const variants = {
    primary: "bg-black text-white px-10 py-4 rounded-full hover:bg-gray-800 hover:scale-105 shadow-lg",
    secondary: "bg-white text-black px-10 py-4 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:bg-gray-50 hover:scale-105",
    link: "text-black underline underline-offset-4 hover:text-gray-600 px-0 py-0"
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
