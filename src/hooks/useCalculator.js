import { useState, useCallback } from 'react';
import { CalculatorStateMachine } from '../logic/stateMachine.js';

// Custom hook for calculator state management
export const useCalculator = () => {
  const [stateMachine] = useState(() => new CalculatorStateMachine());
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [expression, setExpression] = useState('');

  // Handle button clicks
  const handleButtonClick = useCallback((value) => {
    try {
      const mapped = value === 'X' ? 'BACKSPACE' : value;
      const newState = stateMachine.handleInput(mapped);
      setDisplay(newState.display);
      setHistory(newState.history);
      setExpression(newState.expression);
    } catch (error) {
      console.error('Calculator error:', error);
      setDisplay('Error');
      setHistory('');
      setExpression('');
    }
  }, [stateMachine]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event) => {
    const key = event.key;
    
    // Map keyboard keys to calculator buttons
    const keyMap = {
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
      '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
      '.': '.',
      '+': '+', '-': '-', '*': '×', '/': '÷',
      'Enter': '=', '=': '=',
      'Escape': 'C', 'c': 'C',
      'Delete': 'CE', 'Backspace': 'BACKSPACE',
      '%': '%',
      's': '√' // 's' key for square root
    };

    if (keyMap[key]) {
      event.preventDefault();
      handleButtonClick(keyMap[key]);
    }
  }, [handleButtonClick]);

  // Clear calculator
  const clear = useCallback(() => {
    handleButtonClick('C');
  }, [handleButtonClick]);

  // Get current state
  const getCurrentState = useCallback(() => {
    return {
      display,
      history,
      expression,
      isError: display === 'Error'
    };
  }, [display, history, expression]);

  return {
    display,
    history,
    expression,
    handleButtonClick,
    handleKeyPress,
    clear,
    getCurrentState
  };
};
