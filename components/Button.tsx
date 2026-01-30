import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blue' | 'orange';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 whitespace-nowrap";
  
  const variants = {
    primary: "bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-0.5",
    blue: "bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:bg-blue-800 hover:-translate-y-0.5",
    orange: "bg-brand-orange text-white shadow-xl shadow-brand-orange/20 hover:bg-orange-600 hover:-translate-y-0.5",
    secondary: "bg-brand-dark text-white shadow-xl shadow-brand-dark/20 hover:bg-slate-800 hover:-translate-y-0.5",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/10",
    ghost: "bg-transparent text-brand-dark hover:bg-black/5"
  };

  const sizes = "px-8 py-4 text-sm md:text-base";
  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};