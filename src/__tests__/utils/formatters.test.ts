import { formatCurrency } from '@/utils/formatters';
import type { CurrencyFormat } from '@/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    const mockFormat: CurrencyFormat = {
      currency: 'USD',
      placement: 'before' as const,
      numberFormat: '123,456.78'
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
        placement: 'after' as const
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
        numberFormat: '123.456,78'
      };
      expect(formatCurrency(100.5, germanFormat)).toBe('$100,50');

      const spaceFormat: CurrencyFormat = {
        ...mockFormat,
        numberFormat: '123 456.78'
      };
      expect(formatCurrency(100.5, spaceFormat)).toBe('$100.50');
    });
  });
}); 