import React from 'react';
import './Button.css';

const Button = ({ 
  value, 
  onClick, 
  className = '', 
  type = 'number',
  disabled = false 
}) => {
  const buttonClass = `button ${type} ${className}`.trim();
  
  return (
    <button
      className={buttonClass}
      onClick={() => onClick(value)}
      disabled={disabled}
      type="button"
    >
      {value}
    </button>
  );
};

export default Button;
