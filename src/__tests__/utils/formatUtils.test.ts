import { describe, it, expect, beforeEach } from 'vitest';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CurrencyFormat } from '@/types';

describe('formatUtils', () => {
  describe('formatCurrency', () => {
    it('formats currency with symbol before amount', () => {
      const format: CurrencyFormat = {
        currency: 'USD',
        placement: 'before',
        numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      };
      expect(formatCurrency(1234.56, format)).toBe('$1,234.56');
    });

    it('formats currency with symbol after amount', () => {
      const format: CurrencyFormat = {
        currency: 'EUR',
        placement: 'after',
        numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      };
      expect(formatCurrency(1234.56, format)).toBe('1,234.56€');
    });

    it('formats currency with different decimal places', () => {
      const format1: CurrencyFormat = {
        currency: 'USD',
        placement: 'before',
        numberFormat: {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }
      };
      expect(formatCurrency(1234.56, format1)).toBe('$1,235');

      const format2: CurrencyFormat = {
        currency: 'USD',
        placement: 'before',
        numberFormat: {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        }
      };
      expect(formatCurrency(1234.56, format2)).toBe('$1,234.5600');
    });
  });

  describe('formatDate', () => {
    it('formats date in MM/DD/YYYY format', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('03/15/2024');
    });

    it('formats date in DD/MM/YYYY format', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/03/2024');
    });

    it('formats date in YYYY-MM-DD format', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-15');
    });
  });
}); 