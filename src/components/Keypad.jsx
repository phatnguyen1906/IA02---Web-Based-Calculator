import React from 'react';
import Button from './Button';
import './Keypad.css';

const Keypad = ({ onButtonClick }) => {
    const buttons = [
      // Top utility row spanning two columns each
      { value: 'CE', type: 'function', className: 'clear-entry span-2' },
      { value: 'X', type: 'function', className: 'backspace span-2' },

    { value: 'C', type: 'clear', className: 'clear' },
    { value: '±', type: 'function', className: 'sign' },
    { value: '%', type: 'function', className: 'percent' },
    { value: '÷', type: 'operator', className: 'divide' },
    
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: '×', type: 'operator', className: 'multiply' },
    
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '-', type: 'operator', className: 'subtract' },
    
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '+', type: 'operator', className: 'add' },
    
    { value: '√', type: 'function', className: 'sqrt' },
    { value: '0', type: 'number', className: 'zero' },
    { value: '.', type: 'function', className: 'decimal' },
    { value: '=', type: 'equals', className: 'equals' }
  ];

  return (
    <div className="keypad">
      {buttons.map((button, index) => (
        <Button
          key={index}
          value={button.value}
          type={button.type}
          className={button.className}
          onClick={onButtonClick}
        />
      ))}
    </div>
  );
};

export default Keypad;
