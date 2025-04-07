import { calculateCategoryActivity, validateCategoryOperation } from '@/utils/categoryUtils';
import { Transaction } from '@/types';

describe('categoryUtils', () => {
  describe('calculateCategoryActivity', () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        amount: -50,
        description: 'Groceries',
        categoryId: 'cat1',
        date: '2024-04-01T00:00:00.000Z',
        type: 'expense',
        currency: 'USD'
      },
      {
        id: '2',
        amount: -30,
        description: 'Restaurant',
        categoryId: 'cat1',
        date: '2024-04-02T00:00:00.000Z',
        type: 'expense',
        currency: 'USD'
      },
      {
        id: '3',
        amount: -20,
        description: 'Coffee',
        categoryId: 'cat2',
        date: '2024-04-01T00:00:00.000Z',
        type: 'expense',
        currency: 'USD'
      }
    ];

    it('should calculate total activity for a category in the current month', () => {
      const result = calculateCategoryActivity(
        'cat1',
        mockTransactions,
        '2024-04-01T00:00:00.000Z',
        (amount) => amount
      );
      expect(result).toBe(80); // 50 + 30
    });

    it('should return 0 for a category with no transactions', () => {
      const result = calculateCategoryActivity(
        'cat3',
        mockTransactions,
        '2024-04-01T00:00:00.000Z',
        (amount) => amount
      );
      expect(result).toBe(0);
    });

    it('should only include transactions from the current month', () => {
      const result = calculateCategoryActivity(
        'cat1',
        mockTransactions,
        '2024-05-01T00:00:00.000Z',
        (amount) => amount
      );
      expect(result).toBe(0);
    });
  });

  describe('validateCategoryOperation', () => {
    describe('canUpdate', () => {
      it('should return true for valid name and budget', () => {
        expect(validateCategoryOperation.canUpdate('Food', '100')).toBe(true);
      });

      it('should return false for empty name', () => {
        expect(validateCategoryOperation.canUpdate('', '100')).toBe(false);
      });

      it('should return false for invalid budget', () => {
        expect(validateCategoryOperation.canUpdate('Food', 'abc')).toBe(false);
      });

      it('should return false for negative budget', () => {
        expect(validateCategoryOperation.canUpdate('Food', '-100')).toBe(false);
      });
    });

    describe('canDelete', () => {
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          amount: -50,
          description: 'Groceries',
          categoryId: 'cat1',
          date: '2024-04-01T00:00:00.000Z',
          type: 'expense',
          currency: 'USD'
        }
      ];

      it('should return true for category with no transactions', () => {
        expect(validateCategoryOperation.canDelete('cat2', mockTransactions)).toBe(true);
      });

      it('should return false for category with transactions', () => {
        expect(validateCategoryOperation.canDelete('cat1', mockTransactions)).toBe(false);
      });
    });
  });
}); 