import React from 'react';
import './Display.css';

const Display = ({ value, history }) => {
  return (
    <div className="display">
      <div className="display-history">
        {history}
      </div>
      <div className="display-value">
        {value || '0'}
      </div>
    </div>
  );
};

export default Display;
