import React, { useEffect } from 'react';
import { useCalculator } from './hooks/useCalculator.js';
import Display from './components/Display.jsx';
import Keypad from './components/Keypad.jsx';
import './styles/globals.css';

function App() {
  const { display, history, handleButtonClick, handleKeyPress } = useCalculator();

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1 className="calculator-title">Calculator</h1>
      </div>
      
      <Display value={display} history={history} />
      <Keypad onButtonClick={handleButtonClick} />
    </div>
  );
}

export default App;