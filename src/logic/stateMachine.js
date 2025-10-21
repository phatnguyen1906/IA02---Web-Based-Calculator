// Calculator state machine for handling different states
export const CALCULATOR_STATES = {
  INITIAL: 'INITIAL',
  NUMBER_INPUT: 'NUMBER_INPUT',
  OPERATOR_INPUT: 'OPERATOR_INPUT',
  RESULT: 'RESULT',
  ERROR: 'ERROR'
};

// Calculator state machine
export class CalculatorStateMachine {
  constructor() {
    this.state = CALCULATOR_STATES.INITIAL;
    this.display = '0';
    this.history = '';
    this.expression = ''; // Biểu thức đang được nhập
    this.currentNumber = '';
    this.operator = null;
    this.previousNumber = null;
    this.shouldResetDisplay = false;
  }

  // Handle button clicks based on current state
  handleInput(input) {
    switch (this.state) {
      case CALCULATOR_STATES.INITIAL:
        return this.handleInitialState(input);
      case CALCULATOR_STATES.NUMBER_INPUT:
        return this.handleNumberInputState(input);
      case CALCULATOR_STATES.OPERATOR_INPUT:
        return this.handleOperatorInputState(input);
      case CALCULATOR_STATES.RESULT:
        return this.handleResultState(input);
      case CALCULATOR_STATES.ERROR:
        return this.handleErrorState(input);
      default:
        return this.reset();
    }
  }

  handleInitialState(input) {
    if (input === 'CE') {
      this.currentNumber = '';
      this.display = '0';
      return this.getState();
    }
    if (input === 'BACKSPACE') {
      this.currentNumber = '';
      this.display = '0';
      return this.getState();
    }
    if (this.isNumber(input)) {
      // Special handling for decimal point when starting
      if (input === '.') {
        this.currentNumber = '0.';
        this.display = '0.';
        this.expression = '0.';
      } else {
        this.currentNumber = input;
        this.display = input;
        this.expression = input;
      }
      this.state = CALCULATOR_STATES.NUMBER_INPUT;
    } else if (this.isOperator(input)) {
      // Handle unary operators like +/-
      if (input === '±') {
        this.display = '-0';
        this.currentNumber = '-0';
        this.expression = '-0';
        this.state = CALCULATOR_STATES.NUMBER_INPUT;
      } else if (input === '√') {
        // Apply square root to 0 (default)
        const result = Math.sqrt(0);
        const formatted = this.formatResult(result);
        this.currentNumber = formatted;
        this.display = formatted;
        this.history = '√(0)';
        this.expression = formatted;
        this.state = CALCULATOR_STATES.RESULT;
        return this.getState();
      }
    } else if (input === 'C') {
      this.reset();
    }
    return this.getState();
  }

  handleNumberInputState(input) {
    if (input === 'CE') {
      this.currentNumber = '';
      this.display = '0';
      return this.getState();
    }
    if (input === 'BACKSPACE') {
      if (this.currentNumber.length > 0) {
        this.currentNumber = this.currentNumber.slice(0, -1);
      }
      if (this.currentNumber === '' || this.currentNumber === '-') {
        this.currentNumber = '';
        this.display = '0';
      } else {
        this.display = this.currentNumber;
      }
      // update expression if we are in an operation
      if (this.operator && this.previousNumber !== null) {
        const right = this.currentNumber === '' ? '' : this.currentNumber;
        this.expression = `${this.previousNumber} ${this.operator}${right ? ' ' + right : ''}`;
      } else {
        this.expression = this.currentNumber;
      }
      return this.getState();
    }
    if (this.isNumber(input)) {
      if (this.shouldResetDisplay) {
        this.currentNumber = input;
        this.display = input;
        this.expression = input;
        this.shouldResetDisplay = false;
      } else {
        // Special handling for decimal point
        if (input === '.' && this.currentNumber === '') {
          this.currentNumber = '0.';
          this.display = '0.';
          this.expression = '0.';
        } else if (input === '.' && this.currentNumber.includes('.')) {
          // Don't add another decimal point
          return this.getState();
        } else {
          this.currentNumber += input;
          this.display = this.currentNumber;
          // Cập nhật expression với số mới
          if (this.operator && this.previousNumber !== null) {
            this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
          } else {
            this.expression = this.currentNumber;
          }
        }
      }
    } else if (this.isOperator(input)) {
      if (input === '±') {
        this.toggleSign();
      } else if (input === '%') {
        this.applyPercentage();
      } else if (input === '√') {
        // Apply square root to current number
        const num = parseFloat(this.currentNumber);
        if (num < 0) {
          this.display = 'Invalid input';
          this.state = CALCULATOR_STATES.ERROR;
          return this.getState();
        }
        const result = Math.sqrt(num);
        const formatted = this.formatResult(result);
        this.currentNumber = formatted;
        this.display = formatted;
        
        // Check if we're in the middle of an operation
        if (this.operator && this.previousNumber !== null) {
          this.history = `${this.previousNumber} ${this.operator} √(${num})`;
          this.expression = `${this.previousNumber} ${this.operator} ${formatted}`;
        } else {
          this.history = `√(${num})`;
          this.expression = formatted;
        }
        
        this.state = CALCULATOR_STATES.RESULT;
        return this.getState();
      } else {
        this.setOperator(input);
      }
    } else if (input === '=') {
      this.calculateResult();
    } else if (input === 'C') {
      this.reset();
    }
    return this.getState();
  }

  handleOperatorInputState(input) {
    if (input === '±') {
      // Toggle the sign of the right operand being entered (currently empty)
      if (this.currentNumber === '' || this.currentNumber === '0') {
        this.currentNumber = '-0';
        this.display = '-0';
        this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
        this.history = `${this.previousNumber} ${this.operator} (${this.currentNumber})`;
      } else {
        const num = parseFloat(this.currentNumber);
        this.currentNumber = (-num).toString();
        this.display = this.currentNumber;
        this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
        // Always wrap negative to highlight ± usage
        const rightHist = this.currentNumber.startsWith('-') ? `(${this.currentNumber})` : this.currentNumber;
        this.history = `${this.previousNumber} ${this.operator} ${rightHist}`;
      }
      return this.getState();
    }
    if (input === '√') {
      // Apply square root to the right operand being entered
      if (this.currentNumber === '' || this.currentNumber === '0') {
        // If no number entered yet, use 0 as default
        this.currentNumber = '0';
      }
      const num = parseFloat(this.currentNumber);
      if (num < 0) {
        this.display = 'Invalid input';
        this.state = CALCULATOR_STATES.ERROR;
        return this.getState();
      }
      const result = Math.sqrt(num);
      const formatted = this.formatResult(result);
      this.currentNumber = formatted;
      this.display = formatted;
      this.expression = `${this.previousNumber} ${this.operator} ${formatted}`;
      this.history = `${this.previousNumber} ${this.operator} √(${num})`;
      this.state = CALCULATOR_STATES.RESULT;
      return this.getState();
    }
    if (input === 'CE') {
      // clear the right operand entry if any
      this.currentNumber = '';
      this.display = '0';
      this.expression = `${this.previousNumber} ${this.operator}`;
      return this.getState();
    }
    if (input === 'BACKSPACE') {
      // nothing to backspace, stay
      return this.getState();
    }
    if (this.isNumber(input)) {
      this.currentNumber = input;
      this.display = input;
      this.expression = `${this.previousNumber} ${this.operator} ${input}`;
      this.shouldResetDisplay = false; // Không reset khi nhập số tiếp theo
      this.state = CALCULATOR_STATES.NUMBER_INPUT;
    } else if (this.isOperator(input)) {
      if (input === '±') {
        this.toggleSign();
      } else if (input === '%') {
        this.applyPercentage();
      } else {
        this.setOperator(input);
      }
    } else if (input === 'C') {
      this.reset();
    }
    return this.getState();
  }

  handleResultState(input) {
    if (input === '±') {
      // Toggle sign on the current result
      const current = parseFloat(this.currentNumber || '0');
      const negated = -current;
      const formatted = this.formatResult(negated);
      this.currentNumber = formatted;
      this.display = formatted;
      this.history = `(${formatted})`;
      this.expression = formatted;
      return this.getState();
    }
    if (input === '√') {
      // Apply square root to current result
      const current = parseFloat(this.currentNumber || '0');
      if (current < 0) {
        this.display = 'Invalid input';
        this.state = CALCULATOR_STATES.ERROR;
        return this.getState();
      }
      const result = Math.sqrt(current);
      const formatted = this.formatResult(result);
      this.currentNumber = formatted;
      this.display = formatted;
      
      // Check if history already contains √ to determine nesting
      if (this.history.includes('√')) {
        // If history already has √, nest it: √(√(previous))
        this.history = `√(${this.history})`;
      } else {
        // First √ operation, use the current number
        this.history = `√(${current})`;
      }
      
      this.expression = formatted;
      return this.getState();
    }
    if (input === 'CE') {
      // Special case: after a completed calculation, CE clears display and history
      this.currentNumber = '';
      this.display = '0';
      this.history = '';
      this.expression = '';
      return this.getState();
    }
    if (input === 'BACKSPACE') {
      // backspace on result starts new entry
      this.currentNumber = '';
      this.display = '0';
      this.state = CALCULATOR_STATES.INITIAL;
      return this.getState();
    }
    if (this.isNumber(input)) {
      // Không reset, mà tiếp tục với số mới
      this.currentNumber = input;
      this.display = input;
      this.expression = input;
      this.state = CALCULATOR_STATES.NUMBER_INPUT;
    } else if (input === '=') {
      // If there's an incomplete operation, complete it
      if (this.operator && this.previousNumber !== null) {
        this.calculateResult();
      }
      // If no operation, just keep the current result
    } else if (this.isOperator(input)) {
      // Khi nhập operator sau result, sử dụng kết quả hiện tại
      this.operator = input;
      this.previousNumber = parseFloat(this.currentNumber);
      this.history = `${this.currentNumber} ${input}`;
      this.expression = `${this.currentNumber} ${input}`;
      this.shouldResetDisplay = true;
      this.state = CALCULATOR_STATES.OPERATOR_INPUT;
    } else if (input === 'C') {
      this.reset();
    }
    return this.getState();
  }

  handleErrorState(input) {
    if (input === 'CE') {
      this.currentNumber = '';
      this.display = '0';
      this.state = CALCULATOR_STATES.INITIAL;
      return this.getState();
    }
    if (input === 'BACKSPACE') {
      // ignore
      return this.getState();
    }
    if (input === 'C') {
      this.reset();
    }
    return this.getState();
  }

  // Helper methods
  isNumber(input) {
    return /^[0-9.]$/.test(input);
  }

  isOperator(input) {
    return /^[+\-×÷%±√]$/.test(input);
  }

  setOperator(op) {
    if (this.operator && this.previousNumber !== null && this.currentNumber !== '') {
      // Chain operations
      this.calculateResult();
    }
    
    this.operator = op;
    this.previousNumber = parseFloat(this.currentNumber);
    this.history = `${this.currentNumber} ${op}`;
    this.expression = `${this.currentNumber} ${op}`;
    this.shouldResetDisplay = true;
    this.state = CALCULATOR_STATES.OPERATOR_INPUT;
  }

  calculateResult() {
    if (this.operator && this.previousNumber !== null) {
      try {
        const prev = this.previousNumber;
        const current = this.currentNumber === '' ? prev : parseFloat(this.currentNumber);
        let result;

        switch (this.operator) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '×':
            result = prev * current;
            break;
          case '÷':
            if (current === 0) {
              throw new Error('Division by zero');
            }
            result = prev / current;
            break;
          case '%':
            result = prev % current;
            break;
          default:
            throw new Error('Unknown operator');
        }

        // If history already contains √, preserve it; otherwise create new history
        if (this.history.includes('√')) {
          this.history = `${this.history} =`;
        } else {
          this.history = `${this.previousNumber} ${this.operator} ${this.currentNumber} =`;
        }
        this.display = this.formatResult(result);
        this.expression = this.formatResult(result);
        this.currentNumber = this.display;
        this.operator = null;
        this.previousNumber = null;
        this.state = CALCULATOR_STATES.RESULT;
      } catch {
        this.display = 'Error';
        this.state = CALCULATOR_STATES.ERROR;
      }
    } else if (this.currentNumber !== '' && !this.operator) {
      // Case: single number followed by = (e.g., "5 =")
      const num = parseFloat(this.currentNumber);
      this.history = `${this.currentNumber} =`;
      this.display = this.formatResult(num);
      this.expression = this.formatResult(num);
      this.currentNumber = this.display;
      this.state = CALCULATOR_STATES.RESULT;
    }
  }

  toggleSign() {
    if (this.state === CALCULATOR_STATES.RESULT) {
      const num = parseFloat(this.currentNumber || '0');
      const neg = -num;
      const formatted = this.formatResult(neg);
      this.currentNumber = formatted;
      this.display = formatted;
      this.history = `(${formatted})`;
      this.expression = formatted;
      return;
    }
    if (this.currentNumber !== '') {
      const num = parseFloat(this.currentNumber);
      this.currentNumber = (-num).toString();
      this.display = this.currentNumber;
      if (this.previousNumber !== null && this.operator) {
        this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
      } else {
        this.expression = this.currentNumber;
      }
    }
  }

  applyPercentage() {
    if (this.currentNumber !== '') {
      const num = parseFloat(this.currentNumber);
      if (this.previousNumber !== null && this.operator) {
        // Windows Basic style: make right operand = prev * (current/100)
        const percent = (this.previousNumber * num) / 100;
        this.currentNumber = this.formatResult(percent);
        this.display = this.currentNumber;
        this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
      } else {
        this.currentNumber = this.formatResult(num / 100);
        this.display = this.currentNumber;
        this.expression = this.currentNumber;
      }
    }
  }

  applySquareRoot() {
    if (this.currentNumber !== '') {
      const num = parseFloat(this.currentNumber);
      if (num < 0) {
        this.display = 'Invalid input';
        this.state = CALCULATOR_STATES.ERROR;
        return;
      }
      const result = Math.sqrt(num);
      this.currentNumber = this.formatResult(result);
      this.display = this.currentNumber;
      if (this.previousNumber !== null && this.operator) {
        this.expression = `${this.previousNumber} ${this.operator} ${this.currentNumber}`;
      } else {
        this.expression = this.currentNumber;
      }
    }
  }

  formatResult(result) {
    if (typeof result !== 'number' || !isFinite(result)) {
      return 'Error';
    }
    
    // Handle zero
    if (result === 0) {
      return '0';
    }
    
    // Handle scientific notation for very large/small numbers
    if (Math.abs(result) >= 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return result.toExponential(9); // 9 digits + 1 for the first digit = 10 significant digits
    }
    
    // For regular numbers, limit to 10 significant digits
    const absResult = Math.abs(result);
    
    // Round to 10 significant digits
    const factor = Math.pow(10, 10 - Math.floor(Math.log10(absResult)) - 1);
    const rounded = Math.round(result * factor) / factor;
    
    // Format the result
    let formatted = rounded.toString();
    
    // Remove trailing zeros after decimal point, but keep at least one digit after decimal if it was a decimal
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
      // If we removed everything after decimal, add back the decimal point if original had it
      if (!formatted.includes('.')) {
        formatted = formatted.replace(/(\d)$/, '$1');
      }
    }
    
    return formatted;
  }

  reset() {
    this.state = CALCULATOR_STATES.INITIAL;
    this.display = '0';
    this.history = '';
    this.expression = '';
    this.currentNumber = '';
    this.operator = null;
    this.previousNumber = null;
    this.shouldResetDisplay = false;
    return this.getState();
  }

  getState() {
    return {
      display: this.display,
      history: this.history,
      expression: this.expression,
      state: this.state
    };
  }
}
