import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm';

  const variants = {
    primary: 'bg-gradient-to-r from-khet-600 to-khet-500 hover:from-khet-700 hover:to-khet-600 text-white focus:ring-khet-500 shadow-khet-200',
    secondary: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 focus:ring-emerald-400',
    earth: 'bg-gradient-to-r from-earth-600 to-earth-500 hover:from-earth-700 hover:to-earth-600 text-white focus:ring-earth-500 shadow-earth-200',
    outline: 'border-2 border-slate-200 hover:border-khet-500 bg-white text-slate-700 hover:text-khet-700 focus:ring-khet-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-rose-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300 shadow-none'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]', // 44px min height for touch friendliness
    lg: 'px-6 py-3.5 text-base gap-2.5 min-h-[50px]'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {Icon && <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />}
      <span>{children}</span>
    </button>
  );
};
