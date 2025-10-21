// Token types for calculator expressions
export const TOKEN_TYPES = {
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  FUNCTION: 'FUNCTION',
  PARENTHESIS: 'PARENTHESIS'
};

// Token class for representing calculator tokens
export class Token {
  constructor(type, value, precedence = 0) {
    this.type = type;
    this.value = value;
    this.precedence = precedence;
  }
}

// Tokenizer for parsing calculator expressions
export class Tokenizer {
  constructor() {
    this.operators = {
      '+': { precedence: 1, associativity: 'left' },
      '-': { precedence: 1, associativity: 'left' },
      '×': { precedence: 2, associativity: 'left' },
      '÷': { precedence: 2, associativity: 'left' },
      '%': { precedence: 2, associativity: 'left' }
    };
  }

  tokenize(expression) {
    const tokens = [];
    let i = 0;
    
    while (i < expression.length) {
      const char = expression[i];
      
      if (this.isDigit(char) || char === '.') {
        const number = this.parseNumber(expression, i);
        tokens.push(new Token(TOKEN_TYPES.NUMBER, number.value));
        i = number.endIndex;
      } else if (this.operators[char] || char === '*' || char === '/' || char === '√' || char === '^') {
        const operator = char === '*' ? '×' : char === '/' ? '÷' : char;
        tokens.push(new Token(TOKEN_TYPES.OPERATOR, operator, this.operators[operator]?.precedence || 2));
        i++;
      } else if (char === '(' || char === ')') {
        tokens.push(new Token(TOKEN_TYPES.PARENTHESIS, char));
        i++;
      } else if (char === ' ') {
        i++; // Skip whitespace
      } else {
        throw new Error(`Invalid character: ${char}`);
      }
    }
    
    return tokens;
  }

  parseNumber(expression, startIndex) {
    let number = '';
    let i = startIndex;
    let hasDecimal = false;
    
    while (i < expression.length) {
      const char = expression[i];
      
      if (this.isDigit(char)) {
        number += char;
      } else if (char === '.' && !hasDecimal) {
        number += char;
        hasDecimal = true;
      } else {
        break;
      }
      i++;
    }
    
    return {
      value: parseFloat(number),
      endIndex: i
    };
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }
}
