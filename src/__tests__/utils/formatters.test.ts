import { formatCurrency } from '@/utils/formatters';
import type { CurrencyFormat } from '@/types';

describe('formatters', () => {
  describe('formatCurrency', () => {
    const mockFormat: CurrencyFormat = {
      currency: 'USD',
      placement: 'before',
      numberFormat: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      dateFormat: 'MM/DD/YYYY'
    };

    it('formats positive numbers correctly', () => {
      expect(formatCurrency(100.5, mockFormat)).toBe('$100.50');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-100.5, mockFormat)).toBe('-$100.50');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0, mockFormat)).toBe('$0.00');
    });

    it('handles currency placement after the number', () => {
      const afterFormat: CurrencyFormat = {
        ...mockFormat,
        placement: 'after'
      };
      expect(formatCurrency(100.5, afterFormat)).toBe('100.50$');
    });

    it('handles different currencies', () => {
      const eurFormat: CurrencyFormat = {
        ...mockFormat,
        currency: 'EUR'
      };
      expect(formatCurrency(100.5, eurFormat)).toBe('€100.50');
    });

    it('handles different number formats', () => {
      const germanFormat: CurrencyFormat = {
        ...mockFormat,
        numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          decimalSeparator: ',',
          thousandsSeparator: '.'
        }
      };
      expect(formatCurrency(1234.5, germanFormat)).toBe('$1,234.50');

      const spaceFormat: CurrencyFormat = {
        ...mockFormat,
        numberFormat: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          thousandsSeparator: ' '
        }
      };
      expect(formatCurrency(1234.5, spaceFormat)).toBe('$1,234.50');
    });
  });
}); 