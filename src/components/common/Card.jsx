import React from 'react';

export const Card = ({ children, className = '', onClick, hoverable = false, glass = false }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white border border-slate-100 shadow-sm p-4 sm:p-5 transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-slate-200 cursor-pointer active:scale-[0.99]' : ''
      } ${glass ? 'glass-card' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
