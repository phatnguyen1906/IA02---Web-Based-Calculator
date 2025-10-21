import { Tokenizer, TOKEN_TYPES } from './tokens.js';

// Calculator evaluator using Shunting Yard algorithm
export class Evaluator {
  constructor() {
    this.tokenizer = new Tokenizer();
  }

  evaluate(expression) {
    try {
      if (!expression || expression.trim() === '') {
        return 0;
      }

      // Clean expression - replace display symbols with math symbols
      const cleanExpression = this.cleanExpression(expression);
      
      // Tokenize the expression
      const tokens = this.tokenizer.tokenize(cleanExpression);
      
      // Convert to postfix notation
      const postfix = this.infixToPostfix(tokens);
      
      // Evaluate postfix expression
      return this.evaluatePostfix(postfix);
    } catch (error) {
      throw new Error(`Invalid expression: ${error.message}`);
    }
  }

  cleanExpression(expression) {
    return expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '/100*');
  }

  infixToPostfix(tokens) {
    const output = [];
    const operators = [];
    
    for (const token of tokens) {
      if (token.type === TOKEN_TYPES.NUMBER) {
        output.push(token);
      } else if (token.type === TOKEN_TYPES.OPERATOR) {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type === TOKEN_TYPES.OPERATOR &&
          operators[operators.length - 1].precedence >= token.precedence
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else if (token.value === '(') {
        operators.push(token);
      } else if (token.value === ')') {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].value !== '('
        ) {
          output.push(operators.pop());
        }
        if (operators.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        operators.pop(); // Remove '('
      }
    }
    
    // Pop remaining operators
    while (operators.length > 0) {
      if (operators[operators.length - 1].value === '(') {
        throw new Error('Mismatched parentheses');
      }
      output.push(operators.pop());
    }
    
    return output;
  }

  evaluatePostfix(postfix) {
    const stack = [];
    
    for (const token of postfix) {
      if (token.type === TOKEN_TYPES.NUMBER) {
        stack.push(token.value);
      } else if (token.type === TOKEN_TYPES.OPERATOR) {
        if (stack.length < 2) {
          throw new Error('Invalid expression');
        }
        
        const b = stack.pop();
        const a = stack.pop();
        const result = this.performOperation(a, b, token.value);
        stack.push(result);
      }
    }
    
    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }
    
    return stack[0];
  }

  performOperation(a, b, operator) {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
      case '×':
        return a * b;
      case '/':
      case '÷':
        if (b === 0) {
          throw new Error('Division by zero');
        }
        return a / b;
      case '^':
        return Math.pow(a, b);
      case '√':
        if (a < 0) {
          throw new Error('Square root of negative number');
        }
        return Math.sqrt(a);
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  // Format number for display with 12 significant digits rule
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
    
    // Remove trailing zeros after decimal point
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
    }
    
    return formatted;
  }
}
