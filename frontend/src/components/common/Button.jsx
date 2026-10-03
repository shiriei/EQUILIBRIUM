
import React from 'react';

export function Button({ children, onClick, variant = 'default', disabled = false, className = '' }) {
  const baseClass = variant === 'primary' ? 'btn btn-primary' : 'btn';
  return (
    <button className={`${baseClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
