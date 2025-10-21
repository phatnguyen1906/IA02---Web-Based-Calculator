import { describe, it, expect, beforeEach } from 'vitest';
import { Evaluator } from '../logic/evaluator.js';

describe('Evaluator', () => {
  let evaluator;

  beforeEach(() => {
    evaluator = new Evaluator();
  });

  describe('Basic arithmetic operations', () => {
    it('should add two numbers', () => {
      expect(evaluator.evaluate('2 + 3')).toBe(5);
      expect(evaluator.evaluate('10 + 5')).toBe(15);
    });

    it('should subtract two numbers', () => {
      expect(evaluator.evaluate('5 - 3')).toBe(2);
      expect(evaluator.evaluate('10 - 7')).toBe(3);
    });

    it('should multiply two numbers', () => {
      expect(evaluator.evaluate('2 * 3')).toBe(6);
      expect(evaluator.evaluate('4 * 5')).toBe(20);
    });

    it('should divide two numbers', () => {
      expect(evaluator.evaluate('6 / 2')).toBe(3);
      expect(evaluator.evaluate('15 / 3')).toBe(5);
    });
  });

  describe('Complex expressions', () => {
    it('should handle operator precedence', () => {
      expect(evaluator.evaluate('2 + 3 * 4')).toBe(14);
      expect(evaluator.evaluate('10 - 2 * 3')).toBe(4);
    });

    it('should handle parentheses', () => {
      expect(evaluator.evaluate('(2 + 3) * 4')).toBe(20);
      expect(evaluator.evaluate('2 * (3 + 4)')).toBe(14);
    });

    it('should handle nested parentheses', () => {
      expect(evaluator.evaluate('((2 + 3) * 4) - 1')).toBe(19);
    });
  });

  describe('Edge cases', () => {
    it('should handle division by zero', () => {
      expect(() => evaluator.evaluate('5 / 0')).toThrow('Division by zero');
    });

    it('should handle empty expression', () => {
      expect(evaluator.evaluate('')).toBe(0);
      expect(evaluator.evaluate('   ')).toBe(0);
    });

    it('should handle single number', () => {
      expect(evaluator.evaluate('42')).toBe(42);
      expect(evaluator.evaluate('3.14')).toBe(3.14);
    });

    it('should handle decimal numbers', () => {
      expect(evaluator.evaluate('2.5 + 1.5')).toBe(4);
      expect(evaluator.evaluate('3.14 * 2')).toBe(6.28);
    });
  });

  describe('Display symbol conversion', () => {
    it('should convert × to *', () => {
      expect(evaluator.evaluate('2 × 3')).toBe(6);
    });

    it('should convert ÷ to /', () => {
      expect(evaluator.evaluate('6 ÷ 2')).toBe(3);
    });
  });

  describe('Advanced functions', () => {
    it('should handle percentage calculations', () => {
      expect(evaluator.evaluate('50 / 100')).toBe(0.5);
      expect(evaluator.evaluate('25 / 100')).toBe(0.25);
    });

    it('should handle square root calculations', () => {
      expect(evaluator.evaluate('4 ^ 0.5')).toBe(2);
      expect(evaluator.evaluate('9 ^ 0.5')).toBe(3);
      expect(evaluator.evaluate('16 ^ 0.5')).toBe(4);
    });

    it('should handle complex expressions with percentage', () => {
      expect(evaluator.evaluate('100 + 50 / 100')).toBe(100.5);
    });
  });

  describe('Result formatting', () => {
    it('should format large numbers with scientific notation', () => {
      const result = evaluator.formatResult(12345678901);
      expect(result).toContain('e+');
      expect(result).toMatch(/1\.234567890e\+10/);
    });

    it('should format small numbers with scientific notation', () => {
      const result = evaluator.formatResult(0.0000001234567);
      expect(result).toContain('e-');
    });

    it('should limit to 10 significant digits', () => {
      const result = evaluator.formatResult(1234567890.12345);
      expect(result).toMatch(/1234567890/);
    });

    it('should remove trailing zeros', () => {
      const result = evaluator.formatResult(1.230000);
      expect(result).toBe('1.23');
    });

    it('should handle zero', () => {
      const result = evaluator.formatResult(0);
      expect(result).toBe('0');
    });

    it('should handle infinite results', () => {
      const result = evaluator.formatResult(Infinity);
      expect(result).toBe('Error');
    });

    it('should handle NaN results', () => {
      const result = evaluator.formatResult(NaN);
      expect(result).toBe('Error');
    });

    it('should format numbers with exactly 10 significant digits', () => {
      const result = evaluator.formatResult(1234567890);
      expect(result).toBe('1234567890');
    });

    it('should format decimal numbers correctly', () => {
      const result = evaluator.formatResult(3.141592653589793);
      expect(result).toMatch(/3\.141592654/);
    });

    it('should handle numbers just under 10 digits', () => {
      const result = evaluator.formatResult(123456789);
      expect(result).toBe('123456789');
    });

    it('should handle numbers just over 10 digits', () => {
      const result = evaluator.formatResult(12345678901);
      expect(result).toContain('e+');
    });
  });
});
